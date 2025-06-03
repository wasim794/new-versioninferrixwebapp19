export class MenuModel {
  path!: string;
  icon!: string;
  name!: string;
  type!: string;
  order!: number;
  hasSubMenu!: boolean;
  subMenus!: MenuModel[];
}
