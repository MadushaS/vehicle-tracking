import { useEffect, useState, useRef } from 'react';
import { getVehicleList, updateVehicleLocation } from '../services/SupabaseService';
import { getCurrentLocation } from '../services/GeoLocationService';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Button, Select, Link, Accordion, AccordionHeader, AccordionItem, AccordionPanel, Input, Switch, Label, Title1, Title3 } from '@fluentui/react-components';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import LeafletMap from '../components/LeafletMap';

const SeederPage = () => {
  const [vehicleList, setVehicleList] = useState([]);
  const [seeding, setSeeding] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [seedingDuration, setSeedingDuration] = useState(5000);
  const [sos, setSos] = useState(false);
  const [openItems, setOpenItems] = useState(["2"]);
  const { user, login, register, isAuthenticated, isLoading } = useKindeAuth();

  const [intervalId, setIntervalId] = useState(null);

  const seedingDurationRef = useRef();

  useEffect(() => {
    console.log('Seeding Duration:', seedingDuration / 1000);
  }, [seedingDuration]);

  useEffect(() => {
    if (sos) {
      console.warn('SOS on');
    } else {
      console.warn('SOS off');
    }
  }, [sos]);

  const handleSOS = () => {
    const response = confirm(sos ? 'Are you sure you want to stop SOS?' : 'Are you sure you want to start SOS?');
    if (response) {
      setSos(!sos);
    }
  }

  const handleSeeding = async () => {
    const location = await getCurrentLocation();
    if (selectedVehicle) {
      const vehicleData = {
        name: 'Vehicle 1',
        lat: location.lat,
        lng: location.lng,
        id: selectedVehicle,
        user_email: user.email,
        sos: sos
      };

      updateVehicleLocation(vehicleData)
        .then(() => console.log('Vehicle location data seeded'))
        .catch((error) => console.error('Error seeding vehicle location data:', error));
    }
  };

  useEffect(() => {
    intervalId && clearInterval(intervalId) && clearInterval(null);
    if (seeding && !isLoading) {
      handleSeeding();

      const id = setInterval(handleSeeding, seedingDuration);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      clearInterval(intervalId);
      setIntervalId(null);
    };
  }, [seeding, selectedVehicle, seedingDuration, isLoading, sos]);

  const fetchAvailableVehicles = async () => {
    try {
      const vehicles = isAuthenticated ? await getVehicleList(user.email) : [];
      setVehicleList(vehicles);

      if (!selectedVehicle && vehicles.length > 0) {
        setSelectedVehicle(vehicles[0].id);
      }
    } catch (error) {
      console.error('Error fetching vehicle list:', error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchAvailableVehicles();
    }
  }, [selectedVehicle, isLoading]);

  const handleVehicleChange = (event) => {
    setSelectedVehicle(event.target.value);
    fetchAvailableVehicles();
  };

  const handleSeedingToggle = () => {
    const response = confirm(seeding ? 'Are you sure you want to stop seeding?' : 'Are you sure you want to start seeding?')
    if (response) {
      setSeeding(!seeding);
    }
  }

  const handleAccordionToggle = (event, data) => {
    setOpenItems(data.openItems)
  }

  const renderLoadingContent = () => (
    <Loader />
  );

  const renderAuthenticatedContent = () => (
    <>
      <div className="flex flex-1 container mx-auto mt-8 text-center items-center">
        <Title1 className="text-2xl font-bold mb-4">Share live location</Title1 >
        <div className="bg-white w-10/12 md:w-1/2 md:mx-auto mx-8 px-8 py-8 rounded-md shadow-md border text-left">
          <Label htmlFor="vehicle-select" className="text-lg font-semibold text-gray-700 mb-4">
            Select a Vehicle:
          </Label>
          <Select
            id="vehicle-select"
            value={selectedVehicle || ''}
            onChange={handleVehicleChange}
            className="mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
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

          <Label htmlFor="toggle-seeding" className="text-lg font-semibold text-gray-700 w-8">
            Toggle Seeding:
          </Label>
          <Switch
            type='checkbox'
            id="toggle-seeding"
            checked={seeding}
            onChange={handleSeedingToggle}
            className='mt-1 ml-2 focus:outline-none focus:ring focus:border-blue-300'
          />
          {seeding && (
            <div className="mt-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-bounce inline" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="4" className="" />
              </svg>
              <Title3 className='ml-2'>Seeding...</Title3>
            </div>
          )
          }

        </div>
      </div>
      <Accordion multiple collapsible openItems={openItems} onToggle={handleAccordionToggle} className='flex-1 container mx-auto my-8 text-center'>
        <AccordionItem value="1" >
          <AccordionHeader>Seeder Settings</AccordionHeader>
          <AccordionPanel className="flex-1 container mx-auto my-8">
            <div className="bg-white w-10/12 md:w-1/2 md:mx-auto mx-8 px-8 py-8 rounded-md shadow-md border text-left">
              {/* Seeding Duration */}
              <Label htmlFor="seeding-duration" className="text-lg font-semibold text-gray-700 mb-4">
                Seeding Duration:
              </Label>
              <Input
                type="number"
                id="seeding-duration"
                defaultValue={seedingDuration / 1000}
                min={2}
                max={60}
                ref={seedingDurationRef}
                className="mt-1 ml-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                contentAfter="Seconds"
              />
              <Button appearance='primary' className='ml-2 float-end' onClick={() => {
                const {value} = seedingDurationRef.current;
                if (value < 2 || value > 60 || isNaN(value)) {
                  alert('Seeding duration should be between 2 and 60 seconds');
                  return;
                }else{
                  setSeedingDuration(value * 1000);
                }
                
              }
              }>Apply</Button>

              {/* Toggle SOS */}
              <div className="mt-4">
                <Label htmlFor="toggle-sos" className="text-lg font-semibold text-gray-700 w-8">
                  Toggle SOS:
                </Label>
                <Switch
                  type='checkbox'
                  id="toggle-sos"
                  checked={sos}
                  onChange={handleSOS}
                  className='mt-1 ml-2 focus:outline-none focus:ring focus:border-blue-300'
                />
              </div>

              {/* Other Useful Options */}
              {/* Add your other useful options here */}
            </div>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionHeader>Map view</AccordionHeader>
          <AccordionPanel>
            <div className="bg-white mx-auto p-4 rounded-md shadow-md border text-left">
              <div className="mx-auto">
                {vehicleList.length > 0 ? (
                  <LeafletMap type="user" selectedVehicle={null} />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-700 mb-6">No vehicles found.</p>
                    <Link to="/register">
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

export default SeederPage;