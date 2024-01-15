// src/services/mockApi.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_REACT_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_REACT_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchVehicleLocation = async (selectedVehicle) => {
  const vId = selectedVehicle;
  if (!vId) {
    throw new Error('No vehicle selected');
  }
  try {
    const { data, error } = await supabase
      .from('vehi_store')
      .select('*')
      .eq('id', vId)
      .single();

    if (error) {
      console.error('Error fetching initial location:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching initial location:', error);
    return null;
  }
};

export const fetchAllVehicleLocations = async (uid) => {
  if (!uid) {
    throw new Error('No user selected');
  }
  try {
    const { data, error } = await supabase
      .from('vehi_store')
      .select('*')
      .eq('user_email', uid);

    if (error) {
      console.error('Error fetching initial location:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching initial location:', error);
    return null;
  }
};

export const getVehicleList = async (email) => {
  try {
    const { data, error } = await supabase
      .from('vehi_store')
      .select('*')
      .eq('user_email', email);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching vehicle list:', error);
    return [];
  }
};

export const registerVehicle = async (vehicleData) => {
  try {
    const { error } = await supabase
      .from('vehi_store')
      .insert([
        {
          name: vehicleData.name,
          lat: vehicleData.lat,
          lng: vehicleData.lng,
          user_email: vehicleData.user_email,
          icon: vehicleData.icon
        },
      ]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error registering vehicle:', error);
    throw error;
  }
};

export const updateVehicleLocation = async (vehicleData) => {
  try {
    if (vehicleData) {
      const { error } = await supabase
        .from('vehi_store')
        .update({
          lat: vehicleData.lat,
          lng: vehicleData.lng,
          sos: vehicleData.sos,
        })
        .eq('id', vehicleData.id)
        .eq('user_email', vehicleData.user_email)
        .select('*');
      if (error) {
        throw error;
      }

      return true;
    } else {
      return null;
    }

  } catch (error) {
    console.error('Error updating vehicle location:');
    return null;
  }
}