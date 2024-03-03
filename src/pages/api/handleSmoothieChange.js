// handleSmoothieChange.js

import { supabase } from '../../config/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { new: newSmoothie, old: oldSmoothie, event } = req.body;

      // Determine the title and content based on the event type
      let title, content;
      if (event === 'INSERT') {
        title = 'New update!';
        content = 'New smoothie: ' + newSmoothie.name;
      } else if (event === 'UPDATE') {
        title = 'New update!';
        content = 'Smoothie updated: ' + newSmoothie.name;
      }

      // Insert a new row into the notifications table
      const { data, error } = await supabase.from('notifications').insert({ title, content });

      if (error) {
        throw error;
      }

      res.status(200).json({ message: 'Notification added successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Error adding notification: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

