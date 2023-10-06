export const getPermissions = ({ rulesRepo }) => {
  const getRolePermissions = (role: string, resource?: string) => {
    return permissionService({ rulesRepo }).getRolePermissions(role, resource);
  };
  return getRolePermissions;
};

const permissionService = ({ rulesRepo }): { getRolePermissions: (role: string, resource?: string) => Promise<unknown>; } => {
  const getRolePermissions = async (role: string, resource?: string) => {
    const definition = await rulesRepo.getRules();
    if (resource) {
      const rules = definition[0].acl;
      const resources = rules.find((r: { role: string; }) => r.role === role).resources;
      const permissions = resources.find(
        (r: { resource: string; }) => r.resource === resource,
      ).permissions;
      return permissions;
    }
    const rules = definition[0].rbac;
    const permissions = rules.find((r: { role: string; }) => r.role === role).permissions;
    return permissions;
  };
  return { getRolePermissions };
};
