import { useState, useEffect, useRef } from 'react';
import { Button, Input, Label, Title1, Accordion, AccordionHeader, AccordionItem, AccordionPanel, RadioGroup, Radio, Field, Image } from '@fluentui/react-components'; // Assuming Fluent UI components for the form
import LeafletMap from '../components/LeafletMap';
import { registerVehicle } from '../services/SupabaseService'; // Adjust the service function accordingly
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from '../components/Loader';
import { getCurrentLocation } from '../services/GeoLocationService';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { carIcon, airplaneIcon, bicycleIcon, boxTruckIcon, cargoShipIcon, motorBikeIcon, vanIcon } from '../components/Icons';


const VehicleRegistration = () => {
  const { user, login, register, isAuthenticated, isLoading } = useKindeAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedImage, setSelectedImage] = useState('car');
  const [openItems, setOpenItems] = useState(["2"]);
  const vehicleNameRef = useRef();

  const handleAccordionToggle = (event, data) => {
    setOpenItems(data.openItems)
  }

  const handleVehicleRegistration = async () => {
    const vehicleName = vehicleNameRef.current.value;
    if (!vehicleName) {
      alert('Please enter a vehicle name');
      vehicleNameRef.current.focus();
      return;
    }
    const preparedData ={
      name: vehicleNameRef.current.value,
      lat: currentLocation.lat,
      lng: currentLocation.lng,
      user_email: user.email,
      icon: selectedImage
    };

    registerVehicle(preparedData).then(() => {
      alert('Vehicle registered successfully');
    }).catch(() => {
      alert('Error registering vehicle');
    });
  };

  const handleImageRadioChange = (event, data) => {
    setSelectedImage(data.value);
  };


  const handleGetCurrentLocation = async () => {
    if (!isAuthenticated) {
      return;
    }
    const location = await getCurrentLocation();
    const vehicleName = vehicleNameRef.current.value || 'Current Location';

    if (!location) {
      return;
    }

    setCurrentLocation({
      lat: location.lat,
      lng: location.lng,
      name: vehicleName
    });
  };

  const renderLoadingContent = () => (
    <Loader />
  );

  const renderAuthenticatedContent = () => (
    <>
      <div className="flex flex-1 container mx-auto mt-8 text-center items-center">
        <Title1 className="text-2xl font-bold mb-4">Register a new vehicle</Title1 >
        <div className="bg-white w-10/12 md:w-1/2 md:mx-auto mx-8 px-8 py-8 rounded-md shadow-md border text-left">

          <div className='mb-2'>
            <Label htmlFor="vehicle-name" className="text-lg font-semibold text-gray-700 mb-4">
              Vehicle Name:
            </Label>
            <Input
              type='text'
              id="vehicle-name"
              placeholder='Enter vehicle name'
              ref={vehicleNameRef}
              className="mt-1 ml-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <Field label="Select an Icon: " className="text-lg font-semibold text-gray-700 mb-4">
              <RadioGroup layout="vertical" name='icon' defaultChecked='car'>
                <div className="grid grid-col-2 grid-row-2 md:grid-flow-col gap-3 justify-center">
                  <Radio value="car" label={
                    <Image src={carIcon} alt="Car Icon" className="w-16 h-16" />
                  } onChange={handleImageRadioChange} />
                  <Radio value="airplane" label={
                    <Image src={airplaneIcon} alt="Airplane Icon" className="w-16 h-16" />
                  } onChange={handleImageRadioChange} />

                  <Radio value="bicycle" label={
                    <Image src={bicycleIcon} alt="Bicycle Icon" className="w-16 h-16" />
                  } onChange={handleImageRadioChange} />

                  <Radio value="box-truck" label={
                    <Image src={boxTruckIcon} alt="Box Truck Icon" className="w-16 h-16" />
                  } onChange={handleImageRadioChange} />

                </div>

              </RadioGroup>
              <RadioGroup layout="vertical" name='icon'>
                <div className="grid grid-col-2 md:grid-flow-col gap-3 justify-center">
                  <Radio value="cargo-ship" label={
                    <Image src={cargoShipIcon} alt="Cargo Ship Icon" className="w-16 h-16" />
                  } onChange={handleImageRadioChange} />

                  <Radio value="motor-bike" label={
                    <Image src={motorBikeIcon} alt="Motor Bike Icon" className="w-16 h-16" />
                  } onChange={handleImageRadioChange} />

                  <Radio value="van" label={
                    <Image src={vanIcon} alt="Van Icon" className="w-16 h-16" />
                  } onChange={handleImageRadioChange} />
                </div>
              </RadioGroup>
            </Field>
          </div>



          <div className="my-2">
            <Button onClick={handleVehicleRegistration}>Register Vehicle</Button>
          </div>

        </div>
      </div>
      <Accordion multiple collapsible openItems={openItems} onToggle={handleAccordionToggle} className='flex-1 container mx-auto my-8 text-center'>
        <AccordionItem value="2">
          <AccordionHeader>Map view</AccordionHeader>
          <AccordionPanel>
            <div className="bg-white mx-auto p-4 rounded-md shadow-md border text-left">
              <div className="my-8 mx-auto">
                <LeafletMap type="user" />
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

  useEffect(() => {
    handleGetCurrentLocation();
  }, [isLoading]);

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

export default VehicleRegistration;
