import React from "react";
import { Sidebar } from "./sidebar.styles";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "../layout/layout-context";
import { useRouter } from "next/router";

export const SidebarWrapper = () => {
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarContext();

  const role = localStorage.getItem('role');
  console.log(role)


  return (
    <aside className="h-screen z-[202] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={router.pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Administrator">
              <SidebarItem
                isActive={router.pathname === "/clients"}
                title="Clients"
                icon={<CustomersIcon />}
                href="clients"
              />
              <SidebarItem
                isActive={router.pathname === "/plans"}
                title="Plans"
                icon={<PaymentsIcon />}
                href="plans"
              />
              <SidebarItem
                isActive={router.pathname === "/products"}
                title="Products"
                icon={<ProductsIcon />}
                href="products"
              />
              <SidebarItem
                isActive={router.pathname === "/finance"}
                title="Finance"
                icon={<ReportsIcon />}
              />
            </SidebarMenu>

            <SidebarMenu title="Whatsapp">
              <SidebarItem
                isActive={router.pathname === "/scansession"}
                title="Scan Session"
                icon={<DevIcon />}
                href="sessions"
              />
              <SidebarItem
                isActive={router.pathname === "/templatewhatsapp"}
                title="Template Whatsapp"
                icon={<ViewIcon />}
                href="templateWhatsapp"
              />
            </SidebarMenu>
            {role === 'admin' && <SidebarMenu title="Owner">
              <SidebarItem
                isActive={router.pathname === "/accounts"}
                title="Account"
                icon={<DevIcon />}
                href="accounts"
              />
            </SidebarMenu>}

          </div>
        </div>
      </div>
    </aside>
  );
};
