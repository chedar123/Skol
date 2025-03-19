"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "USER" | "ADMIN" | "MODERATOR";
  createdAt: string;
  updatedAt: string;
  _count?: {
    threads?: number;
    posts?: number;
  }
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"USER" | "ADMIN" | "MODERATOR">("USER");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"ALL" | "USER" | "ADMIN" | "MODERATOR">("ALL");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "role">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    // Omdirigera till inloggningssidan om användaren inte är inloggad
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin/users");
      return;
    }

    // Hämta användare om användaren är inloggad
    if (status === "authenticated") {
      fetchUsers();
    }
  }, [status, router]);

  // Effekt för att filtrera och sortera användare
  useEffect(() => {
    if (!users.length) return;

    // Filtrera användare baserat på sökterm och roll
    let filtered = [...users];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        (user.name && user.name.toLowerCase().includes(term)) || 
        (user.email && user.email.toLowerCase().includes(term))
      );
    }
    
    if (filterRole !== "ALL") {
      filtered = filtered.filter(user => user.role === filterRole);
    }
    
    // Sortera användare
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return sortOrder === "asc" 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (sortBy === "role") {
        const roleOrder = { ADMIN: 0, MODERATOR: 1, USER: 2 };
        return sortOrder === "asc"
          ? roleOrder[a.role] - roleOrder[b.role]
          : roleOrder[b.role] - roleOrder[a.role];
      } else {
        // Sortera efter datum
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/users");
      
      if (response.status === 403) {
        // Användaren är inte administratör, omdirigera till startsidan
        router.push("/");
        return;
      }
      
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        setError(data.error || "Ett fel uppstod vid hämtning av användare");
      }
    } catch (error) {
      setError("Ett fel uppstod vid hämtning av användare");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string) => {
    try {
      setError("");
      setSuccessMessage("");
      
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: selectedRole,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage(`Användarens roll har uppdaterats till ${selectedRole}`);
        // Uppdatera användarlistan
        const updatedUsers = users.map(user => 
          user.id === userId ? { ...user, role: selectedRole } : user
        );
        setUsers(updatedUsers);
        setEditingUserId(null);
      } else {
        setError(data.error || "Ett fel uppstod vid uppdatering av användarroll");
      }
    } catch (error) {
      setError("Ett fel uppstod vid uppdatering av användarroll");
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (status === "loading" || (status === "unauthenticated" && typeof window !== "undefined")) {
    return (
      <>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Användarhantering</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}

          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Sök</label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Sök efter namn eller e-post"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            
            <div className="w-full md:w-48">
              <label htmlFor="filterRole" className="block text-sm font-medium text-gray-700 mb-1">Filtrera efter roll</label>
              <select
                id="filterRole"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as "ALL" | "USER" | "ADMIN" | "MODERATOR")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="ALL">Alla roller</option>
                <option value="USER">Användare</option>
                <option value="MODERATOR">Moderatorer</option>
                <option value="ADMIN">Administratörer</option>
              </select>
            </div>
            
            <div className="w-full md:w-48">
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sortera efter</label>
              <div className="flex">
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "createdAt" | "role")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="name">Namn</option>
                  <option value="createdAt">Registrerad</option>
                  <option value="role">Roll</option>
                </select>
                <button
                  onClick={toggleSortOrder}
                  className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-200"
                  title={sortOrder === "asc" ? "Stigande ordning" : "Fallande ordning"}
                >
                  {sortOrder === "asc" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Användare</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">E-post</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Roll</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Aktivitet</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Registrerad</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Åtgärder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 relative mr-3 rounded-full overflow-hidden bg-gray-200">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name || "Användare"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {user.name || "Namnlös användare"}
                            </span>
                            <div className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{user.email || "Ingen e-post"}</td>
                      <td className="py-3 px-4">
                        {editingUserId === user.id ? (
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as "USER" | "ADMIN" | "MODERATOR")}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                          >
                            <option value="USER">Användare</option>
                            <option value="MODERATOR">Moderator</option>
                            <option value="ADMIN">Administratör</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "ADMIN" 
                              ? "bg-red-100 text-red-800" 
                              : user.role === "MODERATOR" 
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-green-100 text-green-800"
                          }`}>
                            {user.role === "ADMIN" 
                              ? "Administratör" 
                              : user.role === "MODERATOR" 
                                ? "Moderator" 
                                : "Användare"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        <div className="flex space-x-2">
                          <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            <span className="font-medium">{user._count?.threads || 0}</span> trådar
                          </div>
                          <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                            <span className="font-medium">{user._count?.posts || 0}</span> inlägg
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {new Date(user.createdAt).toLocaleDateString("sv-SE")}
                      </td>
                      <td className="py-3 px-4">
                        {editingUserId === user.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRoleChange(user.id)}
                              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                            >
                              Spara
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
                            >
                              Avbryt
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingUserId(user.id);
                                setSelectedRole(user.role);
                              }}
                              className="text-xs bg-pink-600 text-white px-2 py-1 rounded hover:bg-pink-700"
                            >
                              Ändra roll
                            </button>
                            <Link 
                              href={`/profil/${user.name || user.id}`}
                              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                            >
                              Profil
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Inga användare matchade din sökning
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 