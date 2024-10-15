from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import json
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

app = FastAPI()

data = pd.read_csv('cutoffs.csv')

class PredictionRequest(BaseModel):
    category: str
    district: str
    year: int

def predict_cutoff(category, district, year):
    filtered_data = data[(data['category'] == category) & (data['district'] == district)]

    predictions = []

    for course in filtered_data['course'].unique():
        course_data = filtered_data[filtered_data['course'] == course]

        if len(course_data) >= 10:
            X = course_data[['year']]
            y = course_data['z_score']

            poly = PolynomialFeatures(degree=2)
            X_poly = poly.fit_transform(X)

            X_train, X_test, y_train, y_test = train_test_split(X_poly, y, test_size=0.2, random_state=42)

            model = LinearRegression()
            model.fit(X_train, y_train)

            predicted_cutoff = model.predict(poly.transform([[year]]))

            unicode = int(course_data['unicode'].iloc[0])
            university = course_data['university'].iloc[0]
            previous_year_cutoff = float(course_data[course_data['year'] == year-1]['z_score'].values[0])  # Convert to float

            predictions.append({
                'course': course,
                'unicode': unicode,
                'university': university,
                'previous_year': previous_year_cutoff,
                'this_year_predicted': round(predicted_cutoff[0], 4)
            })

    if not predictions:
        raise HTTPException(status_code=404, detail="No data available for the given filters.")
    
    return predictions

@app.post("/predict")
def predict(request: PredictionRequest):
    category = request.category
    district = request.district
    year = request.year

    predictions = predict_cutoff(category, district, year)

    return predictions