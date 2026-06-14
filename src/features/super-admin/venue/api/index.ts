import {createVenueAdminApi} from "./venue-admin";
import {createVenueReadApi} from "./venue-read";
import {createVenueCrudApi} from "./venue-crud";
import {createVenuePaymentDetailApi} from "./payment-detail";
import {createVenueConditionsApi} from "./venue-conditions";
import {createHelperApi} from "@/shared/api/helperApi";
import {createS3Api} from "@/shared/api/S3";

export const superAdminVenueService = {
  ...createVenueReadApi(),
  ...createVenueCrudApi(),
  ...createVenuePaymentDetailApi(),
  ...createVenueConditionsApi(),
  ...createVenueAdminApi(),
  ...createHelperApi(),
  ...createS3Api(),
};
