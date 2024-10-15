import ballerina/http;
// import ballerina/log;

// Define HTTP client to post data to model
http:Client model = check new ("http://localhost:8000");

service /predict on new http:Listener(8080) {

    // Handle preflight OPTIONS request for CORS
    resource function options postUserInputData(http:Caller caller, http:Request req) returns error? {
        // Respond with the appropriate CORS headers
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        check caller->respond(response);
    }

    // Handle POST request for user input data
    resource function post postUserInputData(http:Caller caller, http:Request req) returns error? {
        // Get JSON payload from request
        json userInputData = check req.getJsonPayload();
        // log:printInfo("Received Data: " + userInputData.toString());

        // Extract values from JSON payload and assign to variables
        string subject1 = check userInputData.subject1;
        string subject2 = check userInputData.subject2;
        string subject3 = check userInputData.subject3;
        string zScore = check userInputData.zScore;
        string year = check userInputData.year;
        string district = check userInputData.district;

        // Declare category variable
        string category = "PS";

        if (subject1 == "Combined Mathematics" && subject2 == "Physics" && subject3 == "Chemistry") {
            category = "PS";
        }

        // Prepare response JSON to Frontend
        json modelRequest = {
            "category": category,
            "district": district,
            "year": year
        };

         // Send data to model and receive response
        http:Response modelRes = check model->post("/predict", modelRequest);

        // Get the response payload from the model
        json modelResponseData = check modelRes.getJsonPayload();

        // Cast modelResponseData to a JSON array
        json[] filteredModelResponseData = [];

        // Parse zScore as a float
        float zScoreValue = check 'float:fromString(zScore);

        //  Filter based on 'this_year_predicted'
        if (modelResponseData is json[]) {
            foreach json obj in modelResponseData {
                float this_year_predicted = check obj.this_year_predicted;
                if (this_year_predicted <= zScoreValue) {
                    filteredModelResponseData.push(obj);
                }
            }
        }

        // Create combined response JSON including both the original and filtered data
        json modelResponse = {
            "modelResponseData": modelResponseData,
            "filteredModelResponseData": filteredModelResponseData
        };

        // Send response with CORS headers
        http:Response res = new;
        res.setJsonPayload(modelResponse);
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        // Send response to the frontend
        check caller->respond(res);
    }
}