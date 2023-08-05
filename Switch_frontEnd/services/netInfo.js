import NetInfo from '@react-native-community/netinfo';

import React from 'react';

async function netInfo() {
    return NetInfo.fetch();
}

export default netInfo;