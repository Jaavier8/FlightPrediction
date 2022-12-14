from pymongo import MongoClient

client = MongoClient()

pipeline = [
    {
        "$group": {
            "_id": "$Origin",
            "destAllowed": {
                "$addToSet": "$Dest"
            }
        }
    },
    {
        "$project": {
            "_id": 0,
            "origin": "$_id",
            "destAllowed": "$destAllowed"
        }
    }
]

originAndAllowedDest = list(
    client.agile_data_science.origin_dest_distances.aggregate(pipeline))

originAirports = client.agile_data_science.origin_dest_distances.distinct(
    "Origin")
destAirports = client.agile_data_science.origin_dest_distances.distinct("Dest")
totalAirports = list(set(originAirports) | set(destAirports))

with open(r'./originDest.json', 'w') as fp:
    fp.write("{\n")
    for item in originAndAllowedDest:
        # write each item on a new line
        fp.write("'%s':" % item['origin'])
        fp.write("%s,\n" % item['destAllowed'])
    fp.write("}")

with open(r'./airports.json', 'w') as fp:
    fp.write("[\n")
    for item in totalAirports:
        # write each item on a new line
        fp.write("'%s',\n" % item)
    fp.write("]")
