"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import ErrorMessage from "@/components/ui/ErrorMessage";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

type User = {
  id: number;
  email: string;
  name?: string;
  username?: string;
  role?: string;
  disabled?: boolean;
  sessionVersion?: number;
  createdAt: string;
};

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  // Note: add-user form removed in favor of AG Grid editing
  const [error, setError] = useState<any>(null);
  const gridRef = useRef<AgGridReact<User> | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Column definitions for AG Grid
  // Removed DOM-based renderer; using a string-based renderer + onCellClicked handler instead

  const openDeleteConfirm = (id: number) => {
    setDeleteCandidateId(id);
    setConfirmOpen(true);
  };

  const columnDefs = useMemo<ColDef<User>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        editable: false,
        minWidth: 80,
        maxWidth: 120,
      },
      { field: "name", headerName: "Name" },
      { field: "email", headerName: "Email" },
      { field: "username", headerName: "Username" },
      {
        field: "role",
        headerName: "Role",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["user", "admin", "moderator"] },
      },
      {
        field: "createdAt",
        headerName: "Created At",
        valueFormatter: (params) =>
          params.value ? new Date(params.value).toLocaleString() : "",
        editable: false,
      },
      {
        headerName: "Actions",
        colId: 'actions',
        cellRenderer: (params: any) => {
          const id = params?.data?.id ?? '';
          const disabled = params?.data?.disabled ? true : false;
          return (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
              <button data-action="edit" data-id={id} className="px-2 py-1 text-xs bg-transparent hover:bg-slate-100 rounded">Edit</button>
              <button data-action="reset-password" data-id={id} className="px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded">Reset PW</button>
              <button data-action="toggle-disable" data-id={id} className={`px-2 py-1 text-xs ${disabled ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'} text-white rounded`}>
                {disabled ? 'Enable' : 'Disable'}
              </button>
              <button data-action="revoke-sessions" data-id={id} className="px-2 py-1 text-xs bg-purple-600 text-white hover:bg-purple-700 rounded">Revoke Sessions</button>
              <button data-action="delete" data-id={id} className="px-2 py-1 text-xs text-red-600 hover:bg-red-100 rounded">Delete</button>
            </div>
          );
        },
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '6px 10px' },
        editable: false,
        minWidth: 220,
        maxWidth: 520,
      }
    ],
    [openDeleteConfirm]
  );

  async function loadUsers() {
    setError(null);
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
    else {
      const body = await res.json().catch(() => null);
      setError(body ?? "Failed to load users");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // addUser removed; creation should be handled via AG Grid or a dedicated UI

  async function deleteUser(id: number) {
    setError(null);
    setDeleting(true);
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) loadUsers();
    else {
      const body = await res.json().catch(() => null);
      setError(body ?? "Failed to delete");
    }
    setDeleting(false);
  }

  async function patchUser(id: number, data: Partial<User>) {
    setError(null);
    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body ?? "Failed to update");
    } else {
      // success, refresh
      loadUsers();
    }
  }

  return (
    <div>
      {/* Add-user form removed; use AG Grid for creation/editing if needed */}
      <ErrorMessage error={error} />
      <div className="ag-theme-alpine h-[560px] w-full">
        <AgGridReact<User>
          ref={(r) => {
            gridRef.current = r;
          }}
          rowData={users}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            editable: true,
            flex: 1,
          }}
          animateRows
          onCellValueChanged={(params) => {
            const id = (params.data as any)?.id;
            const field = params.colDef?.field as keyof User;
            if (!id || !field) return;
            const value = params.newValue;
            patchUser(id, { [field]: value } as any);
          }}
          onCellClicked={(params) => {
            const colId = params.column?.getColId?.() ?? params.colDef?.colId ?? params.colDef?.headerName;
            // If the clicked cell is an actions cell, check the exact action from the data-action attribute of the click target
            if ((colId === 'actions' || colId === 'action') && params.event && params.event.target) {
              const target = params.event.target as HTMLElement;
              const action = target.getAttribute?.('data-action');
              const idAttr = target.getAttribute?.('data-id');
              const id = idAttr ? Number(idAttr) : (params.data?.id as number | undefined);
              if (action === 'delete' && id) openDeleteConfirm(id);
              if (action === 'edit' && id) {
                // keep current behaviour: select the row and start editing the first editable cell, if any
                const columnApi: any = (params as any).columnApi;
                const col: any = columnApi?.getAllDisplayedColumns()?.find((c: any) => c.getColId() !== 'actions');
                if (col && params.rowIndex !== null && params.rowIndex !== undefined) {
                  params.api?.startEditingCell?.({ rowIndex: params.rowIndex as number, colKey: col.getColId() });
                }
              }
              if (action === 'reset-password' && id) {
                const newPw = window.prompt('Enter new password (min 6 chars)');
                if (newPw && newPw.length >= 6) {
                  fetch(`/api/users/${id}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'reset-password', newPassword: newPw }) })
                    .then((r) => r.ok ? loadUsers() : r.json().then(setError))
                    .catch(setError);
                }
              }
              if (action === 'toggle-disable' && id) {
                const row = params.data as any;
                const next = !row?.disabled;
                fetch(`/api/users/${id}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'disable', disabled: next }) })
                  .then((r) => r.ok ? loadUsers() : r.json().then(setError))
                  .catch(setError);
              }
              if (action === 'revoke-sessions' && id) {
                fetch(`/api/users/${id}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'revoke-sessions' }) })
                  .then((r) => r.ok ? loadUsers() : r.json().then(setError))
                  .catch(setError);
              }
            } else {
              // fallback for other cells or if `data-action` is not present
              if ((colId === 'actions' || colId === 'action') && params.data?.id) {
                openDeleteConfirm(params.data.id as number);
              }
            }
          }}
          rowSelection="single"
          columnDefs={columnDefs}
        />
      </div>
      <Modal open={confirmOpen} onClose={() => { if (!deleting) setConfirmOpen(false); }} title="Confirm Delete" backdrop>
        <div className="space-y-4">
          <div className="text-sm">Are you sure you want to delete this user?</div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={deleting}>Cancel</Button>
            <Button variant="danger" onClick={async () => { if (deleteCandidateId) { await deleteUser(deleteCandidateId); setConfirmOpen(false); setDeleteCandidateId(null); } }} disabled={deleting}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// We use a simple HTML string cell renderer for actions and handle clicks via onCellClicked events.
