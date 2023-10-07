import { Response, NextFunction } from 'express';
import { getPermissions } from './service';

export const initAuthorization = ({ rulesRepo}) => {
  const isAuthorized = (permission: string, resource?: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (req: any, res: Response, next: NextFunction) => {
      if (req.session.passport && req.session.passport.user.role) {
        if (await permitted(req.session.passport.user.role, permission, resource)) {
          return next();
        }
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
