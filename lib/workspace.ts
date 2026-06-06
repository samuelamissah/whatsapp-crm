import { createSupabaseServerClient } from "@/lib/supabase-server";

type Workspace = {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: string;
  is_active: boolean;
};

export async function getCurrentWorkspace() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      workspace: null,
      role: null,
      error: "Unauthorized",
    };
  }

  const { data, error } = await supabase
    .from("workspace_members")
    .select(
      `
      role,
      workspace:workspaces (
        id,
        name,
        slug,
        owner_id,
        plan,
        is_active
      )
    `
    )
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error || !data?.workspace) {
    return {
      user,
      workspace: null,
      role: null,
      error: "No workspace found",
    };
  }

  const workspace = Array.isArray(data.workspace)
    ? data.workspace[0]
    : data.workspace;

  return {
    user,
    workspace: workspace as Workspace,
    role: data.role as string,
    error: null,
  };
}