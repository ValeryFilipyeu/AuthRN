import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkTimestamp = async (
  timeoutMinutes: number,
  logoutCallback: () => void
) => {
  const timestamp = await AsyncStorage.getItem("timestamp");
  const currentTime = Date.now();
  const timeDifference = currentTime - parseInt(timestamp as string);

  if (timeDifference > timeoutMinutes * 60 * 1000) {
    logoutCallback();
  } else {
    setTimeout(checkTimestamp, 60 * 1000);
  }
};
