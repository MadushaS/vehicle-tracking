// src/components/Navbar.js
import { Link } from 'react-router-dom';
import { NavigationFilled, NavigationRegular, bundleIcon } from '@fluentui/react-icons';
import {
  Button,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
  MenuDivider,
  Title2,
  Link as FluentLink
} from '@fluentui/react-components';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

const Navigation = bundleIcon(NavigationFilled, NavigationRegular);

const Navbar = () => {
  const { login, register, logout, isAuthenticated } = useKindeAuth();

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <Title2 className='text-lg text-blue-900' >Vehicle Tracker</Title2>
        </Link>

        {/* Mobile Menu Button */}
        <div className={`block md:hidden md:space-x-4 mt-4 md:mt-0`}>
          <Menu >
            <MenuTrigger disableButtonEnhancement>
              <Button iconPosition='after' icon={<Navigation />}>Menu</Button>
            </MenuTrigger>

            <MenuPopover>
              <MenuList>
                <MenuItem>
                  <Link
                    to="/register"
                    className="text-gray-800 hover:text-blue-500 transition duration-300"
                  >
                    Register
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/track"
                    className="text-gray-800 hover:text-blue-500 transition duration-300"
                  >
                    Track
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/seed"
                    className="text-gray-800 hover:text-blue-500 transition duration-300"
                  >
                    Track
                  </Link>
                </MenuItem>
                <MenuDivider />
                {isAuthenticated ?
                  <MenuItem>
                    <FluentLink onClick={logout} as='button' appearance='subtle'>
                      Logout
                    </FluentLink>

                  </MenuItem>
                  :
                  <>
                    <MenuItem>
                      <FluentLink as='button' appearance='subtle' onClick={() =>
                        login({
                          app_state: {
                            redirectTo: location.state ? location.state?.from?.pathname : null
                          }
                        })
                      }>
                        Login
                      </FluentLink>
                    </MenuItem>
                    <MenuItem>
                      <FluentLink as='button' appearance='subtle' onClick={() =>
                        register({
                          app_state: {
                            redirectTo: location.state ? location.state?.from?.pathname : null
                          }
                        })
                      }>
                        Register
                      </FluentLink>
                    </MenuItem>
                  </>
                }
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>

        {/* Navigation Links */}
        <div className={`md:flex md:space-x-4 mt-4 md:mt-0 hidden`} >
          <Link to="/register" className="text-gray-600 hover:text-blue-500 transition duration-300 mx-2" >
            Register
          </Link>
          <Link to="/track" className="text-gray-600 hover:text-blue-500 transition duration-300 mx-2">
            Track
          </Link>
          <Link to="/seed" className="text-gray-600 hover:text-blue-500 transition duration-300 mx-2">
            Seed
          </Link>


        </div>

        {/* Login Button */}
        <Link className='md:flex md:space-x-4 mt-4 md:mt-0 hidden'>
          {isAuthenticated ?
            <Button appearance='primary' onClick={logout}>Logout</Button>
            :
            <>
              <Button appearance='primary' onClick={() =>
                login({
                  app_state: {
                    redirectTo: location.state ? location.state?.from?.pathname : null
                  }
                })
              }>Login</Button>
              <Button appearance='secondary' onClick={() =>
                register({
                  app_state: {
                    redirectTo: location.state ? location.state?.from?.pathname : null
                  }
                })
              }>Register</Button>
            </>
          }
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;
