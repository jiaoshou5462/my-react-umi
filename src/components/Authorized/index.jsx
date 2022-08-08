import Authorized from './Authorized';
import check from './CheckPermissions';
import renderAuthorize from './renderAuthorize';

Authorized.check = check;
const RenderAuthorize = renderAuthorize(Authorized);
export default RenderAuthorize;
