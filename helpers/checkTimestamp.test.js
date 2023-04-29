import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkTimestamp } from "./checkTimestamp";

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

describe("checkTimestamp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call logoutCallback if the time difference is greater than the timeout", async () => {
    const getItemSpy = jest
      .spyOn(AsyncStorage, "getItem")
      .mockResolvedValue("1000");
    const logoutCallback = jest.fn();

    await checkTimestamp(1, logoutCallback);

    expect(getItemSpy).toHaveBeenCalledWith("timestamp");
    expect(logoutCallback).toHaveBeenCalled();
  });

  it("should call setTimeout if the time difference is less than the timeout", async () => {
    const getItemSpy = jest
      .spyOn(AsyncStorage, "getItem")
      .mockResolvedValue(Date.now().toString());
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");
    const logoutCallback = jest.fn();

    await checkTimestamp(1, logoutCallback);

    expect(getItemSpy).toHaveBeenCalledWith("timestamp");
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 60 * 1000);
    expect(logoutCallback).not.toHaveBeenCalled();
  });
});