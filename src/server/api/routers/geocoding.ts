import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";
import { GeoUser } from "@prisma/client";
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'opencage',
  apiKey: env.OPENCAGE_API_KEY, 
  formatter: null
};
const geocoder = NodeGeocoder(options);

export interface DetailedGeoUser extends GeoUser {
    streetName: string;
    zipcode: string;
}

export const geoCodeRouter = createTRPCRouter({
    reverseGeoCode: privateProcedure
            .input(z.object({lat: z.number(), lng: z.number()}))
            .query( async({ input, ctx }) => {
                try{
                    const { lat, lng } = input;
                    const [ {latitude, longitude,
                        country, city, state, county, streetName, zipcode } ] = await geocoder.reverse({lat, lon:lng})

                    const geoUser: DetailedGeoUser = {
                        id: ctx.currentUser.user.userId,
                        userid: ctx.currentUser.user.userId,
                        lat: latitude,
                        lng: longitude,
                         country,
                            city,
                            county,
                            state,
                            streetName,
                            zipcode
                    }
                  
                    return {
                        geoUser
                    }
                }catch(err){
                    if(err instanceof Error){
                        throw new TRPCError({message: err.message, code: "INTERNAL_SERVER_ERROR"})
                    } else {
                        console.log('unexpected error', err)
                    }
                }
            })
})