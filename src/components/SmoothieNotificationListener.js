// SmoothieNotificationListener.js
import { useEffect } from 'react';
import  supabase  from '../config/supabaseClient';

const SmoothieNotificationListener = () => {
  useEffect(() => {
    // Set up a listener for changes in the smoothies table
    const subscription = supabase
      .from('smoothies')
      .on('*', (payload) => {
        console.log('Change in smoothies table:', payload);
        // Handle the change here, such as showing a notification
        alert('New smoothie update!');
      })
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default SmoothieNotificationListener;

