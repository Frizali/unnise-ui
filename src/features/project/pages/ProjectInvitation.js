import { useProjectInvitation } from "../hooks/useProjectInvitation";

export function ProjectInvitation() {
  const { invitation, loading } = useProjectInvitation();

  return <>Hallo</>;
}
