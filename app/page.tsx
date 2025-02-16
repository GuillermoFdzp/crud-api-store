"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { addPet, deletePet, getPetById, updatePet } from '../services/petstore';
import { findPetsByStatus } from '../services/petstore'; // Ensure this function exists in the module


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

  if (error) return <div>Error al cargar las mascotas</div>;
  if (!pets) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1 className="title">Petstore API Crud</h1>
      <div className="filterContainer">
        <label className="label">
          Filter by Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="select">
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </label>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="th">ID</th>
            <th className="th">Nombre</th>
            <th className="th">Status</th>
            <th className="th">CRUD</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet: any) => (
            <tr key={pet.id} className="tr">
              <td className="td">{pet.id}</td>
              <td className="td">{pet.name}</td>
              <td className="td">{pet.status}</td>
              <td className="td">
                <button onClick={() => handleEditPet(pet.id)} className="button">Edit</button>
                <button onClick={() => handleDeletePet(pet.id)} className="button deleteButton">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="subtitle">{editMode ? 'Edit Pet' : 'Add Pet'}</h2>
      <div className="formContainer">
        <input 
          type="text" 
          value={petId ?? ''} 
          onChange={(e) => setPetId(Number(e.target.value) || null)} 
          className="input" 
          placeholder="ID"
        />
        <input
          type="text"
          placeholder="Nombre de mascota"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          className="input"
        />
        <select value={petStatus} onChange={(e) => setPetStatus(e.target.value)} className="select">
          <option value="available">Disponible</option>
          <option value="pending">Pendiente</option>
          <option value="sold">Vendida</option>
        </select>
        <button onClick={editMode ? handleUpdatePet : handleAddPet} className="button">
          {editMode ? 'Actualizar Mascota' : 'Agregar mascota'}
        </button>
      </div>
    </div>
  );
};

export default HomePage;