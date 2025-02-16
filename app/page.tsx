"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { addPet, deletePet, getPetById, updatePet } from '../services/petstore';
import { findPetsByStatus } from '../services/petstore';

const HomePage = () => {
  const [status, setStatus] = useState('available');
  const [petId, setPetId] = useState<number | null>(null);
  const [petName, setPetName] = useState('');
  const [petStatus, setPetStatus] = useState('available');
  const [editMode, setEditMode] = useState(false);

  const { data: pets, error, mutate } = useSWR(
    ['findPetsByStatus', status],
    () => findPetsByStatus([status])
  );

  const handleAddPet = async () => {
    if (!petId || !petName) {
      alert('ID y nombre son obligatorios');
      return;
    }
    await addPet({ id: petId, name: petName, status: petStatus });
    mutate();
    setPetName('');
    setPetId(null);
    setPetStatus('available');
  };

  const handleUpdatePet = async () => {
    if (!petId || !petName) {
      alert('ID y nombre son obligatorios');
      return;
    }
    await updatePet({ id: petId, name: petName, status: petStatus });
    mutate();
    setPetId(null);
    setPetName('');
    setPetStatus('available');
    setEditMode(false);
  };

  const handleDeletePet = async (id: number) => {
    await deletePet(id);
    mutate();
  };

  const handleEditPet = async (id: number) => {
    const pet = await getPetById(id);
    setPetId(pet.id);
    setPetName(pet.name);
    setPetStatus(pet.status);
    setEditMode(true);
  };

  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-lg">Error al cargar las mascotas</div>;
  if (!pets) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div></div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Petstore API CRUD</h1>
      
      <div className="mb-8">
        <label className="block mb-2 font-medium text-gray-700">Filtrar por estado:</label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="available">Disponible</option>
          <option value="pending">Pendiente</option>
          <option value="sold">Vendida</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-sm font-medium text-gray-700">ID</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-700">Nombre</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-700">Estado</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pets.map((pet: any) => (
              <tr key={pet.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 text-center text-gray-800">{pet.id}</td>
                <td className="px-6 py-4 text-center text-gray-800">{pet.name}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-3 py-1 text-sm rounded-full
                    ${pet.status === 'available' ? 'bg-green-100 text-green-800' : 
                    pet.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                    {pet.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => handleEditPet(pet.id)} 
                      className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >Editar</button>
                    <button 
                      onClick={() => handleDeletePet(pet.id)} 
                      className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                    >Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">{editMode ? 'Editar Mascota' : 'Agregar Mascota'}</h2>
        <div className="bg-gray-50 p-8 rounded-xl space-y-6">
          <input 
            type="text" 
            value={petId ?? ''} 
            onChange={(e) => setPetId(Number(e.target.value) || null)} 
            className="w-full p-3 bg-white border border-gray-200 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="ID"
          />
          <input
            type="text"
            placeholder="Nombre de mascota"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select 
            value={petStatus} 
            onChange={(e) => setPetStatus(e.target.value)} 
            className="w-full p-3 bg-white border border-gray-200 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="available">Disponible</option>
            <option value="pending">Pendiente</option>
            <option value="sold">Vendida</option>
          </select>
          <button 
            onClick={editMode ? handleUpdatePet : handleAddPet} 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            {editMode ? 'Actualizar Mascota' : 'Agregar Mascota'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;