
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)
// Function to create user
async function createUser(email, password) {
    const { user, error } = await supabase.auth.signUp({
        email,
        password,
    });
    return { user, error };
}

export { createUser };
export default supabase