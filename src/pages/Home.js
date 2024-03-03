import React, { useEffect, useState, useRef, navigate } from "react";
import supabase from "../config/supabaseClient"; // Import Supabase client
import SmoothieCard from "../components/SmoothieCard";
import OneSignal from 'react-onesignal';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);
  const [orderBy, setOrderBy] = useState('created_at');
  const [subscribedSmoothies, setSubscribedSmoothies] = useState([]);
  const [followedSmoothies, setFollowedSmoothies] = useState([]);
  const [user, setUser] = useState(null); // State to store user information
  const navigate = useNavigate();

  const [isOneSignalReady, setIsOneSignalReady] = useState(false);
  //const oneSignalInitialized = useRef(false); // useRef to track OneSignal initialization

  /*If you're unsure about the initialization state, you can check if OneSignal 
  is ready or wait for the OneSignal.on('initialized', () => {}) event if available in your SDK version.*/

 /* 
*/



// const oneSignalAppId = "b9c41c33-8196-4883-a129-21ce0ce5df41"



//   //const [user, setUser] = useState<User | null>(null)

//   const [oneSignalInitialized, setOneSignalInitialized] = useState(false)

//   /**
//    * Initializes OneSignal SDK for a given Supabase User ID
//    * @param uid Supabase User ID
//    */
//   const initializeOneSignal = async () => {
//     if (oneSignalInitialized) {
//       return
//     }
//     setOneSignalInitialized(true)
//     await OneSignal.init({
//       appId: oneSignalAppId,
//       notifyButton: {
//         enable: true,
//       },

//       allowLocalhostAsSecureOrigin: true,
//     })

//    // await OneSignal.setExternalUserId(uid)
//   }

  // Fetch user information from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          setFetchError("Error fetching user: " + error.message);
        } else {
          setUser(data);
         // initializeOneSignal(); // Call initializeOneSignal function
          console.log("User Data:", user.user); // Print user data to console
         try {
            await supabase
              .from("User_Smoothies")
              .update({ logged_in: true })
              .eq("user_id", user.user.id);
          } catch (error) {
            console.error("Error updating logged_in status:", error.message);
          }
        }
      } catch (error) {
        setFetchError("Error fetching user: " + error.message);
      }
    };

    fetchUser();
  },[]);

  const isSubscribed = (smoothieId) => {
    return subscribedSmoothies.includes(smoothieId);
};

useEffect(() => {
  const fetchSubscriptions = async () => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('User_Smoothies')
          .select('smoothie_id')
          .eq('user_id', user.user.id);

        if (error) {
          throw error;
        }

        // Assuming 'data' is an array of objects with a 'smoothie_id' property
        const subscribedIds = data.map(subscription => subscription.smoothie_id);
        setSubscribedSmoothies(subscribedIds);
      } catch (error) {
        setFetchError("Error fetching subscriptions: " + error.message);
      }
    }
  };

  fetchSubscriptions();
}, [user]);

const handleSubscribe = async (smoothieId) => {
  try {
      try {
        await supabase
          .from("User_Logged")
          .update({ logged_in: true })
          .eq("user_id", user.user.id);
      } catch (error) {
        console.error("Error updating logged_in status:", error.message);
      }
      // Insert a new row into the User_Smoothies table
      const { error } = await supabase
          .from('User_Smoothies')
          .insert([{ user_id: user.user.id, smoothie_id: smoothieId }]);

      if (error) {
          throw error;
      }

      //updateOneSignalTags();

      console.log('Subscribed to smoothie:', smoothieId);
      // Ensure no duplicates by using a Set
      setSubscribedSmoothies(prevIds => [...new Set([...prevIds, smoothieId])]);

      // Fetch the details of the subscribed smoothie and add it to the followed smoothies list
      const { data: smoothieData, error: smoothieError } = await supabase
          .from('smoothies')
          .select()
          .eq('id', smoothieId);

      if (smoothieError) {
          throw smoothieError;
      }

      const smoothie = smoothieData[0]; // Get the first smoothie from the response
      // Add the smoothie to the followed smoothies list if it's not already there
      setFollowedSmoothies(prevSmoothies => {
          if (prevSmoothies.some(s => s.id === smoothieId)) {
              return prevSmoothies;
          }
          return [...prevSmoothies, smoothie];
      });
  } catch (error) {
      console.error('Error subscribing to smoothie:', error.message);
  }
};


const handleUnfollow = async (smoothieId) => {
  try {
      // Delete the row from the User_Smoothies table
      const { error } = await supabase
          .from('User_Smoothies')
          .delete()
          .eq('user_id', user.user.id)
          .eq('smoothie_id', smoothieId);

      if (error) {
          throw error;
      }

     // updateOneSignalTags();

      console.log('Unsubscribed from smoothie:', smoothieId);
      // Remove the smoothie ID from the list of subscribed smoothies
      setSubscribedSmoothies(prevIds => prevIds.filter(id => id !== smoothieId));

      // Remove the smoothie from the followed smoothies list
      setFollowedSmoothies(prevSmoothies => prevSmoothies.filter(smoothie => smoothie.id !== smoothieId));
  } catch (error) {
      console.error('Error unsubscribing from smoothie:', error.message);
  }
};




  const handleDelete = (id) => {
    setSmoothies(prevSmoothies => {
      return prevSmoothies.filter(sm => sm.id !== id);
    });
  };

  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase
        .from('smoothies')
        .select()
        .order(orderBy, { ascending: true });

      if (error) {
        setFetchError('Could not fetch the smoothies');
        setSmoothies(null);
        console.log(error);
      }
      if (data) {
        setSmoothies(data);
        setFetchError(null); // Reset fetch error on successful fetch
      }
    };

    fetchSmoothies();
  }, [orderBy]);


  // Function to handle toggling follow status

  const toggleFollow = (smoothieId) => {
    // Check if the user is already subscribed to the smoothie
    const isAlreadySubscribed = subscribedSmoothies.includes(smoothieId);
  
    if (isAlreadySubscribed) {
      // If subscribed, call handleUnfollow to unsubscribe
      handleUnfollow(smoothieId);
    } else {
      // If not subscribed, call handleSubscribe to subscribe
      handleSubscribe(smoothieId);
    }
  };
  // Fetch followed smoothies by the logged-in user
  useEffect(() => {
    const fetchFollowedSmoothies = async () => {
        if (user && smoothies) { // Add null check for smoothies
            try {
                // Fetch smoothie IDs followed by the user from the User_Smoothies table
                const { data, error } = await supabase
                    .from("User_Smoothies")
                    .select("smoothie_id")
                    .eq("user_id", user.user.id);
                if (error) {
                    throw error;
                }

                // Extract the smoothie IDs from the fetched data
                const followedSmoothieIds = data.map((item) => item.smoothie_id);

                // Filter the smoothies array to get only the followed smoothies
                const followedSmoothiesData = smoothies.filter((smoothie) =>
                    followedSmoothieIds.includes(smoothie.id)
                );

                setFollowedSmoothies(followedSmoothiesData);
            } catch (error) {
                setFetchError("Error fetching followed smoothies: " + error.message);
            }
        }
    };

    fetchFollowedSmoothies();
}, [user, smoothies]);



////////// LOG IN ////////////////
// let logoutClicked = false;

// // Define isLoggedIn function
// const isLoggedIn = async () => {
  
//   // Call isLoggedIn function only if logout button hasn't been clicked
//   if (user.user) {
//     try {
//       // Update logged_in status in the database
//       await supabase
//         .from("User_Smoothies")
//         .update({ logged_in: true })
//         .eq("user_id", user.user.id);
//       return true; // Return true if update is successful
//     } catch (error) {
//       console.error("Error updating logged_in status:", error.message);
//       return false; // Return false if update fails
//     }
//   }
// };

// // Call isLoggedIn function
// isLoggedIn().then((loggedIn) => {
//   if (user.user){
//   if (loggedIn) {
//     console.log("User is logged in.");
//   } else {
//     console.log("Error occurred while updating logged_in status.");
//   }}
// });



//////////// SIGN OUT ////////////////////
const handleSignOut = async () => {
  //logoutClicked = true;
   // First, fetch user data
   const fetchUserData = async () => {
    try {
     
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          // Handle error if needed
        } else {
          setUser(data);
          console.log("User Data:", data); // Print user data to console
          // Update logged_in status in User_Smoothies table
          try {
            await supabase
              .from("User_Logged")
              .update({ logged_in: false })
              .eq("user_id", data.user.id);
          } catch (error) {
            console.error("Error updating logged_in status:", error.message);
          }
        
      }
    } catch (error) {
      // Handle error if needed
    }
  };

  await fetchUserData(); // Call fetchUserData on component mount 
  
 
  const { error } = await supabase.auth.signOut();

  if (!error) {
    navigate("/login"); // Redirect after successful sign out
  } else {
    console.error('Sign out error:', error.message);
  }
}; 



   // Display greeting message with user's email
   const greeting = user ? `Hi, ${user.user.email}` : "Hi, you've logged out";

   return (
    <div className="page home">
      <h2 className="greeting-message">
        {user ? `Hi, ${user.user.email}` : "Hi, you've logged out"}
        {<button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>}
      </h2>
      {fetchError && (<p>{fetchError}</p>)}
      {smoothies && (
        <div className="smoothies">
          <div className="order-by">
            <button onClick={() => setOrderBy('created_at')}>Time Created</button>
            <button onClick={() => setOrderBy('title')}>Title</button>
            <button onClick={() => setOrderBy('rating')}>Rating</button>
            {orderBy}
          </div>
          <div className="smoothie-grid">
            {smoothies.map(smoothie => (
              <div key={smoothie.id}>
                <SmoothieCard
                  smoothie={smoothie}
                  onDelete={handleDelete}
                />
                {/* Render subscribe button or "Following" based on subscription status */}
                <button onClick={() => toggleFollow(smoothie.id)} className={`subscribe-button ${isSubscribed(smoothie.id) ? 'following' : ''}`}>
                  {isSubscribed(smoothie.id) ? 'Following' : 'Subscribe'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="followed-companies">
        <h2>Followed Smoothies:</h2>
        <ul>
          {followedSmoothies.map((smoothie) => (
            <li key={smoothie.id}>{smoothie.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;


/*
import type {NextPage} from "next";
import Head from "next/head";
import React from "react";
import OneSignal from "../components/OneSignal";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const buttonClicked = async () => {
    const {OneSignal} = window;
    const tags = await OneSignal.getTags();
    const {clicks} = tags;

    console.log("Tags", tags);
    const updatedClicks = clicks ? parseInt(clicks, 10) + 1 : 1;
    const tagSent = await OneSignal.sendTags({
      ...tags,
      clicks: updatedClicks,
    });
    console.log("New tags", tagSent);
  }
} */