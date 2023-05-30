import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'opencage',

  // Optional depending on the providers
 
  apiKey: env.OPENCAGE_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const geoData = await geocoder.reverse({lat:req.body.lat  , lon: req.body.lng});
  res.status(200).json(geoData as any);
}