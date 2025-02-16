'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { addPet, deletePet, findPetsByStatus, getPetById, updatePet } from '../services/petstore';

const HomePage = () => {
  const [status, setStatus] = useState<string>('available');
  const [petId, setPetId] = useState<number | null>(null);
  const [petName, setPetName] = useState<string>('');
  const [petStatus, setPetStatus] = useState<string>('available');
  const [editMode, setEditMode] = useState<boolean>(false);

  // Corregir el uso de useSWR para pasar directamente el status
  const { data: pets, error, mutate } = useSWR(() => findPetsByStatus([status]));

  const handleAddPet = async () => {
    // Validar si petId es nulo antes de enviar la solicitud
    if (petId === null || petName === '') {
      alert('ID y nombre son obligatorios');
      return;
    }

    const newPet = {
      id: petId,
      name: petName,
      status: petStatus,
    };
    await addPet(newPet);
    mutate();
    setPetName('');
    setPetId(null);
    setPetStatus('available');
  };

  const handleUpdatePet = async () => {
    if (petId && petName) {
      const updatedPet = {
        id: petId,
        name: petName,
        status: petStatus,
      };
      await updatePet(updatedPet);
      mutate();
      setPetId(null);
      setPetName('');
      setPetStatus('available');
      setEditMode(false);
    } else {
      alert('ID y nombre son obligatorios');
    }
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
    <div style={styles.container}>
      <h1 style={styles.title}>Petstore API Crud</h1>
      <div style={styles.filterContainer}>
        <label style={styles.label}>
          Filter by Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </label>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>CRUD</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet: any) => (
            <tr key={pet.id} style={styles.tr}>
              <td style={styles.td}>{pet.id}</td>
              <td style={styles.td}>{pet.name}</td>
              <td style={styles.td}>{pet.status}</td>
              <td style={styles.td}>
                <button onClick={() => handleEditPet(pet.id)} style={styles.button}>Edit</button>
                <button onClick={() => handleDeletePet(pet.id)} style={{ ...styles.button, ...styles.deleteButton }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={styles.subtitle}>{editMode ? 'Edit Pet' : 'Add Pet'}</h2>
      <div style={styles.formContainer}>
        <input 
          type="text" 
          value={petId ?? ''} 
          onChange={(e) => setPetId(Number(e.target.value) || null)} 
          style={styles.input} 
          placeholder="ID"
        />
        <input
          type="text"
          placeholder="Nombre de mascota"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          style={styles.input}
        />
        <select value={petStatus} onChange={(e) => setPetStatus(e.target.value)} style={styles.select}>
          <option value="available">Disponible</option>
          <option value="pending">Pendiente</option>
          <option value="sold">Vendida</option>
        </select>
        <button onClick={editMode ? handleUpdatePet : handleAddPet} style={styles.button}>
          {editMode ? 'Actualizar Mascota' : 'Agregar mascota'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center' as const,
    color: '#333',
  },
  filterContainer: {
    marginBottom: '20px',
  },
  label: {
    marginRight: '10px',
  },
  select: {
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '20px',
  },
  th: {
    backgroundColor: '#f4f4f4',
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left' as const,
  },
  tr: {
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '5px 10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '5px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  subtitle: {
    color: '#333',
  },
  formContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    flex: '1',
  },
};

export default HomePage;
