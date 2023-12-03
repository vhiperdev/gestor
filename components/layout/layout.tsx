"use client";
// buat context untuk userId
import React, { useEffect, createContext, useContext, useState } from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext } from "./layout-context";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { Forbidden } from "../forbidden";

interface Props {
  children: React.ReactNode;
}

// const checkUserRole = async (username) => {
//   const response = await fetch(`/api/accounts/getAccountByUsername?username=${username}`, {
//     headers: {
//       'X-Authorization': "YXRoaWZhYXJlemE6YXJlemFhdGhpZmE=",
//     },
//   });
//   const data = await response.json();
//   const userRole = data['data'];

//   return userRole;
// }

export const Layout = ({ children }: Props) => {
  const [userId, setUserId] = useState();
  const { user, error, isLoading } = useUser();
  const [role, setRole] = React.useState(""); // ['admin', 'user']
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  var userRole;

  useEffect(() => {
    
  }, [])
  

  const getUserRole = (email) => {
    fetch(`api/accounts/getAccountByEmail?email=${email}`, {
      headers: {
        "X-Authorization": process.env.API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const dataUser = data["data"];

        if (dataUser.length != 0) {
          //set to local storage
          localStorage.setItem("email", `${dataUser[0].email}`);
          localStorage.setItem("name", `${dataUser[0].username}`);
          localStorage.setItem("id", `${dataUser[0].id}`);
          localStorage.setItem("picture", `${dataUser[0].picture}`);
          if (dataUser[0]["role"] === 1) {
            localStorage.setItem("role", "admin");
            setRole("admin");
          }
          if (dataUser[0]["role"] === 0) {
            localStorage.setItem("role", "user");
            setRole("user");
          }
        } else if (dataUser.length == 0) {
          setRole(null);
        }
      });
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("picture");
    localStorage.removeItem("role");
  };

  if (isLoading) {
    return <div></div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (user && !isLoading) {
    // Calling API to get user role
    getUserRole(user.email);
    console.log(user);

    // Check if user has role
    if (role != null) {
      if (role === "admin") {
        return (
          <SidebarContext.Provider
            value={{
              collapsed: sidebarOpen,
              setCollapsed: handleToggleSidebar,
            }}
          >
            <section className="flex">
              <SidebarWrapper />
              <NavbarWrapper>{children}</NavbarWrapper>
            </section>
          </SidebarContext.Provider>
        );
      } else if (role === "user") {
        return (
          <SidebarContext.Provider
            value={{
              collapsed: sidebarOpen,
              setCollapsed: handleToggleSidebar,
            }}
          >
            <section className="flex">
              <SidebarWrapper />
              <NavbarWrapper>{children}</NavbarWrapper>
            </section>
          </SidebarContext.Provider>
        );
      }
    } else {
      setTimeout(() => {
        router.push("/api/auth/logout"); // Delete session jika user tidak memiliki role
        return null;
      }, 5000);
      return <Forbidden />;
    }
  }
  if (!user) {
    clearLocalStorage();
    router.push("/api/auth/login"); // Delete session jika user tidak memiliki role
    return null;
  }
};
