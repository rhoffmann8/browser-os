import { toast } from "react-toastify";
import { create } from "zustand";
import { wait } from "../utils/array";

export enum PowerEnum {
  Off,
  On,
  PoweringOn,
  PoweringOff,
  Rebooting,
}

interface PowerState {
  powerState: PowerEnum;
  powerOn: () => void;
  powerOff: () => void;
  reboot: () => void;
}

export const usePowerStore = create<PowerState>((set) => {
  return {
    powerState: PowerEnum.On,
    powerOn: async () => {
      set({ powerState: PowerEnum.PoweringOn });
      await wait(1300);
      set({ powerState: PowerEnum.On });
    },
    powerOff: async () => {
      toast.info("Powering off...", { autoClose: 250 });
      set({ powerState: PowerEnum.PoweringOff });
      await wait(750);
      set({ powerState: PowerEnum.Off });
    },
    reboot: async () => {
      toast.info("Restarting...", { autoClose: 500 });
      set({ powerState: PowerEnum.Rebooting });
      await wait(500);
      localStorage.clear();
      window.location.reload();
    },
  };
});
