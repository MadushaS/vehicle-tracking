// src/pages/TrackingPage.js
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import LeafletMap from '../components/LeafletMap';
import { getVehicleList, } from '../services/SupabaseService';
import getWeatherInfo from '../services/WeatherService';
import { Select, Button, Link, Title1, Accordion, AccordionHeader, AccordionItem, AccordionPanel, MessageBar, MessageBarBody, MessageBarTitle, Text, Switch, Label } from '@fluentui/react-components';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import PropTypes from 'prop-types';
import WeatherBox from '../components/WeatherBox';

const VehicleTracking = () => {

  const [vehicleList, setVehicleList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [trackAll, setTrackAll] = useState(false);
  const [openItems, setOpenItems] = useState(["2"]);
  const [sosVisibility, setSOSVisibility] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [autoZoomDisabled, setAutoZoomDisabled] = useState(false);

  const { login, register, user, isAuthenticated, isLoading } = useKindeAuth();

  const handleAccordionToggle = (event, data) => {
    setOpenItems(data.openItems)
  }

  const handleTrackAllChange = (event, data) => {
    setTrackAll(data.checked);
  };

  const handleAutoZoomChange = (event, data) => {
    setAutoZoomDisabled(data.checked);
  };

  const handleSOSCallback = (SOSValue) => {
    setSOSVisibility(SOSValue);
  }

  const renderLoadingContent = () => (
    <Loader />
  );

  const weatherUpdateCallback = async (lat, lng) => {
    const weather = await getWeatherInfo(lat, lng);
    setWeatherInfo(weather);
  }

  const renderAuthenticatedContent = () => (
    <>
      <div className="flex flex-1 container mx-auto mt-8 text-center items-center">
        <Title1 className="text-2xl font-bold mb-4">Track your Vehicles</Title1 >
        <div className="bg-white w-10/12 md:w-1/2 md:mx-auto mx-8 px-8 py-8 rounded-md shadow-md border text-left">
          <div>
            <Label htmlFor="vehicle-all" className="text-lg font-semibold text-gray-700">
              Track all vehicles:
            </Label>
            <Switch
              id="vehicle-all"
              defaultChecked={false}
              onChange={handleTrackAllChange}
              className="mt-1 focus:border-blue-300"
            />
          </div>
          <div>
            <Label htmlFor="vehicle-select" className="text-lg font-semibold text-gray-700">
              Select a Vehicle:
            </Label>
            <Select
              id="vehicle-select"
              value={selectedVehicle || ''}
              onChange={handleVehicleChange}
              className="mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              disabled={trackAll}
            >
              {vehicleList?.length === 0 && (
                <option value="" disabled>
                  No Vehicles Found
                </option>
              )}

              {vehicleList.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name}
                </option>
              ))}
            </Select>
            {sosVisibility && (
              <div className='container mx-auto my-8 text-center'>
                <MessageBar key='warning' intent="warning">
                  <MessageBarBody>
                    <MessageBarTitle>Emergancy</MessageBarTitle>
                    <Text className="animate-pulse text-red-500 font-bold text-lg text-center my-4">There is an emergancy in your vehicle</Text>
                  </MessageBarBody>
                </MessageBar>
              </div>
            )}

          </div>
        </div>
      </div>

      <Accordion multiple collapsible openItems={openItems} onToggle={handleAccordionToggle} className='flex-1 container mx-auto my-8 text-center'>
        <AccordionItem value="1">
          <AccordionHeader>Weather View</AccordionHeader>
          <AccordionPanel>
            <WeatherBox weather={weatherInfo} />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="2">
          <AccordionHeader>Map view</AccordionHeader>
          <AccordionPanel>
            <div className="bg-white mx-auto p-4 rounded-md shadow-md border text-left">
              <div className="flex flex-row justify-between items-center">
                <Title1 className="text-2xl font-bold mb-4">Map View</Title1 >
                <div className="flex flex-row justify-between items-center">
                  <Label htmlFor="vehicle-all" className="text-lg font-semibold text-gray-700">
                    Disable Auto Zoom:
                  </Label>
                  <Switch
                    id="vehicle-all"
                    defaultChecked={false}
                    onChange={handleAutoZoomChange}
                    className="mt-1 focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="my-8 mx-auto">
                {vehicleList.length > 0 ? (
                  <LeafletMap type={trackAll ? "all" : "vehicle"} selectedVehicle={trackAll ? null : selectedVehicle} sosCallback={handleSOSCallback} onChange={weatherUpdateCallback} autoZoom={!autoZoomDisabled} />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-700 mb-6">No vehicles found.</p>
                    <Link href="/register">
                      <Button appearance='primary'>Register a Vehicle</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );

  const renderUnauthorizedContent = () => (
    <div className="flex flex-1 container mx-auto my-8 text-center items-center">
      <div className="mt-8 p-8 bg-white rounded-md shadow-md max-w-md w-full mx-auto">
        <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
        <p className="text-gray-700 mb-6">You need to be logged in to access this page.</p>

        {/* Action Buttons */}
        <div className="flex space-x-4 justify-center">
          <Button appearance='primary' onClick={() =>
            login({
              app_state: {
                redirectTo: location.state ? location.state?.from?.pathname : null
              }
            })
          }>
            Login
          </Button>
          <Button appearance='secondary' onClick={() =>
            register({
              app_state: {
                redirectTo: location.state ? location.state?.from?.pathname : null
              }
            })
          }>
            Register
          </Button>
        </div>
      </div>
    </div>
  );

  const fetchAvailableVehicles = async () => {
    try {
      const vehicles = isAuthenticated ? await getVehicleList(user.email) : [];
      setVehicleList(vehicles);

      // Only set selectedVehicle if it's not already set and the vehicles array is not empty
      if (!selectedVehicle && vehicles.length > 0) {
        setSelectedVehicle(vehicles[0].id);
      }
    } catch (error) {
      console.error('Error fetching vehicle list:', error);
    }
  };

  useEffect(() => {
    fetchAvailableVehicles();
  }, [selectedVehicle, isLoading]);

  const handleVehicleChange = (event) => {
    setSelectedVehicle(event.target.value);
  };

  let content;
  if (isLoading) {
    content = renderLoadingContent();
  } else if (isAuthenticated) {
    content = renderAuthenticatedContent();
  } else {
    content = renderUnauthorizedContent();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      {content}

      <Footer />
    </div>
  );
};

export default VehicleTracking;

VehicleTracking.propTypes = {
  selectedVehicle: PropTypes.string,
};