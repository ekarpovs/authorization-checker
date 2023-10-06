import { Request, Response, NextFunction } from 'express';
import { getPermissions } from './service';

export const initAuthorization = ({ rulesRepo }, { getUserData }) => {
  const isAuthorized = (permission: string, resource?: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const user = await getUserData(req.body.userId);
      if (!user) {
        res.sendStatus(404);
      }
      if (await permitted(user.role, permission, resource)) {
        return next();
      }
      res.sendStatus(403);
    };
  };

  const permitted = async (
    role: string,
    permission: string,
    resource?: string,
  ) => {
    const permissions = await getPermissions({ rulesRepo })(role, resource) as [string];
    return permissions.includes(permission);
  };
  return isAuthorized;
};
