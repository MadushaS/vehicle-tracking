import { MessageBar } from '@fluentui/react-components';
import { MessageBarTitle } from '@fluentui/react-components';
import { MessageBarBody } from '@fluentui/react-components';
import { Title2, Text, Image } from '@fluentui/react-components';
import PropTypes from 'prop-types';

const WeatherBox = (config) => {
    const { weather } = config;
    if (!weather) {
        return (
            <div className="flex flex-col items-center justify-center">
                <MessageBar key='warning' intent="warning">
                    <MessageBarBody>
                        <MessageBarTitle>
                            No Weather Information
                        </MessageBarTitle>
                        <Text className="text-red-500 font-bold text-lg text-center my-4">There is no weather information currently available</Text>
                    </MessageBarBody>
                </MessageBar>
            </div>
        )
    }
    return (
        <div className="bg-white w-10/12 md:w-1/2 md:mx-auto mx-8 px-8 py-8 rounded-md shadow-md border text-left">
            <div>
                <div className="flex flex-row justify-between">
                    <Title2 as='h2' className="text-2xl font-bold mb-4">Weather Information</Title2>
                </div>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row">
                        <Image src={weather.icon} alt="Weather Icon" className='w-16 h-16 mr-4' />
                    </div>
                    <div className="flex flex-col">
                        <Text size={500} weight='semibold' className="font-semibold text-gray-700">Temperature</Text>
                        <Text size={500} weight='semibold' className="font-semibold text-gray-700">Description</Text>
                    </div>
                    <div className="flex flex-col">
                        <Text size={500} font='numeric' className="font-semibold text-gray-700">{weather.temperature} °C</Text>
                        <Text size={500} font='numeric' className="font-semibold text-gray-700">{weather.description}</Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

WeatherBox.propTypes = {
    weather: PropTypes.object,
};

export default WeatherBox;