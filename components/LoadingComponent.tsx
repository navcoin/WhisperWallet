import {ActivityIndicator} from 'react-native';
import React, {Fragment} from 'react';

const LoadingComponent = ({isLoading = true, message, error}) => {
  return (
    <Fragment>
      {isLoading ? <ActivityIndicator size="large" color="#bb5533" /> : null}
    </Fragment>
  );
};

export default LoadingComponent;
