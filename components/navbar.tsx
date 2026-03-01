// server wrapper for the Navbar client logic

import { createClient } from "@/lib/supabase/server";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  // fetch user session on the server so the client can hydrate
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // pass the user as initial prop to prevent flicker
  return <NavbarClient initialUser={user} />;
}
