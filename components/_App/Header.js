import {Menu,Container,Image,Icon} from 'semantic-ui-react';
import Link from 'next/link';
import Router, {useRouter} from 'next/router';
import Nprogress from "nprogress";
import { handleLogout } from "../../utils/auth";


Router.onRouteChangeStart = () => Nprogress.start();
Router.onRouteChangeComplete = () => Nprogress.done();
Router.onRouteChangeError = () => Nprogress.done();

const Header = ({ user }) => {
  const router = useRouter()

  const isRoot = user && user.role === 'root'
  const isAdmin = user && user.role === 'admin'

  const isRootorAdmin = isRoot || isAdmin
 

  const isActive = (route) => {
          return router.pathname === route
  }
  return (
    <Menu fluid id="menu" stackable inverted>
        <Container text>
              <Link href="/">
                      <Menu.Item active={isActive("/")}>
                            <Image
                              size="mini"
                              src="/static/logo.svg"
                              style={{marginRight:'1rem'}}
                              />
                              ReactReserve
                      </Menu.Item>
              </Link>

              <Link href="/cart">
                      <Menu.Item active={isActive("/cart")}>
                            <Icon
                              name="cart"
                              size="large"
                              />
                              Cart
                      </Menu.Item>
              </Link>

              {isRootorAdmin && <Link href="/create">
                      <Menu.Item active={isActive("/create")}>
                            <Icon
                              name="add square"
                              size="large"
                              />
                              Create
                      </Menu.Item>
              </Link>
             }

       { user ? 
         ( 
         <>
              <Link href="/account">
                      <Menu.Item active={isActive("/account")}>
                            <Icon
                              name="user"
                              size="large"
                              />
                              Account
                      </Menu.Item>
              </Link>

             
                      <Menu.Item onClick={handleLogout} header>
                            <Icon
                              name="sign out"
                              size="large"
                              />
                              Log out
                      </Menu.Item>
               </> 
               ) : 
               (
                  <>
                      <Link href="/login">
                      <Menu.Item active={isActive("/login")}>
                            <Icon
                              name="sign  in"
                              size="large"
                              />
                              LogIn
                      </Menu.Item>
              </Link>


              <Link href="/signup">
                      <Menu.Item active={isActive("/signup")}>
                            <Icon
                              name="signup"
                              size="large"
                              />
                              Signup
                      </Menu.Item>
              </Link>

              </>
          )
      }

              
        </Container>
    </Menu>
    )
}

export default Header;
