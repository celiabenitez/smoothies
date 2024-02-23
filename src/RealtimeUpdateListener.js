import { useEffect } from 'react';
import  supabase from '../config/supabaseClient';

const RealtimeUpdatesListener = () => {
  useEffect(() => {
    // Create a Supabase channel for real-time updates
    const channel = supabase.channel('realtime-updates');

    // Subscribe to PostgreSQL database changes for the smoothies table
    channel
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'smoothies' }, (payload) => {
        console.log('Smoothie updated:', payload);
        // Handle the update here, e.g., update state or trigger a function
      })
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default RealtimeUpdatesListener;
