// import ballerina/http;

// type semesterDetails record {|
//     readonly int id;
//     string semester;
//     int noOfSubjects;
//     float totalCredits;
// |};

// type moduleDetails record {|
//     readonly int id;
//     string moduleCode;
//     string moduleName;
//     float credits;
//     int semesterId;
// |};

// type student record {|
//     readonly int id;
//     string studentId;
//     string studentName;
//     string enrolledSemester;
// |};

// table<semesterDetails> key(id) semesterDetailsTable = table [
//     {id: 1, semester: " L1S1", noOfSubjects: 6, totalCredits: 17.5},
//     {id: 2, semester: " L1S2", noOfSubjects: 7, totalCredits: 19.5},
//     {id: 3, semester: " L2S1", noOfSubjects: 6, totalCredits: 16.0},
//     {id: 4, semester: " L2S2", noOfSubjects: 7, totalCredits: 20.0},
//     {id: 5, semester: " L3S1", noOfSubjects: 9, totalCredits: 22.0},
//     {id: 6, semester: " L3S2", noOfSubjects: 5, totalCredits: 20.0},
//     {id: 7, semester: " L4S1", noOfSubjects: 5, totalCredits: 20.0},
//     {id: 8, semester: " L4S2", noOfSubjects: 5, totalCredits: 20.0}
// ];

// table <moduleDetails> key(id) moduleDetailsTable = table [
//     {id: 1, moduleCode: "CM1111", moduleName: "Fundamentals of Mathematics", credits: 2.5, semesterId: 1},
//     {id: 2, moduleCode: "IN1101", moduleName: "Programming Fundamentals", credits: 4.0, semesterId: 1},
//     {id: 3, moduleCode: "IN1311", moduleName: "Digital System DesigN", credits:3.0, semesterId: 1},
//     {id: 4, moduleCode: "IN1321", moduleName: "Computer Organization", credits: 2.5, semesterId: 1},
//     {id: 5, moduleCode: "IS1011	", moduleName: "english", credits: 3, semesterId: 1},
//     {id: 6, moduleCode: "CS1006", moduleName: "Software Engineering", credits: 4.0, semesterId: 2},
//     {id: 7, moduleCode: "CS1007", moduleName: "Web Technologies", credits: 4.0, semesterId: 2},
//     {id: 8, moduleCode: "CS1008", moduleName: "Mobile Application Development", credits: 4.0, semesterId: 2},
//     {id: 9, moduleCode: "CS1009", moduleName: "Cloud Computing", credits: 4.0, semesterId: 2},
//     {id: 10, moduleCode: "CS1010", moduleName: "Artificial Intelligence", credits: 4.0, semesterId: 2},
//     {id: 11, moduleCode: "CS1011", moduleName: "Machine Learning", credits: 4.0, semesterId: 2},
//     {id: 12, moduleCode: "CS1012", moduleName: "Cyber Security", credits: 4.0, semesterId: 2},
//     {id: 13, moduleCode: "CS1013", moduleName: "Big Data", credits: 4.0, semesterId: 2},
//     {id: 14, moduleCode: "CS1014", moduleName: "Software Architecture", credits: 4.0, semesterId: 3},
//     {id: 15, moduleCode: "CS1015", moduleName: "Software Quality Assurance", credits: 4.0, semesterId: 3}
// ];

// table <student>key(id) studentTable = table [
//     {id: 1, studentId: "214001G", studentName: "John Doe", enrolledSemester: "L1S1"},
//     {id: 2, studentId: "214003D", studentName: "Jane Doe", enrolledSemester: "L1S1"},
//     {id: 3, studentId: "214002K", studentName: "John Smith", enrolledSemester: "L1S1"},
//     {id: 4, studentId: "214004K", studentName: "Jane Smith", enrolledSemester: "L1S1"},
//     {id: 5, studentId: "214005L", studentName: "John Doe", enrolledSemester: "L1S1"},
//     {id: 6, studentId: "214006P", studentName: "Jane Doe", enrolledSemester: "L1S1"},
//     {id: 7, studentId: "214007J", studentName: "John Smith", enrolledSemester: "L1S1"},
//     {id: 8, studentId: "214008D", studentName: "Jane Smith", enrolledSemester: "L1S1"},
//     {id: 9, studentId: "214009J", studentName: "John Doe", enrolledSemester: "L1S1"},
//     {id: 10, studentId: "214010H", studentName: "Jane Doe", enrolledSemester: "L1S1"},
//     {id: 11, studentId: "214011H", studentName: "John Smith", enrolledSemester: "L1S1"},
//     {id: 12, studentId: "214012J", studentName: "Jane Smith", enrolledSemester: "L1S1"},
//     {id: 13, studentId: "214013Y", studentName: "John Doe", enrolledSemester: "L1S1"},
//     {id: 14, studentId: "214014H", studentName: "Jane Doe", enrolledSemester: "L1S1"},
//     {id: 15, studentId: "214015J", studentName: "John Smith", enrolledSemester: "L1S1"}
// ];

// service /university\-selection on new http:Listener(9090) {
   
//     resource function get universitySelection/[string studentId]/[ string semester]() returns json|error {
//         table<student> studentRecord = from student s in studentTable
//                                  where s.studentId == studentId
//                                  select s;

//         if studentRecord.length() == 0{
//             return { "error": "Student not found" };
//         }

//         table<semesterDetails> semesterRecord = from semesterDetails sd in semesterDetailsTable
//                                           where sd.semester == semester
//                                           select sd;

//         if semesterRecord.length() == 0{
//             return { "error": "Semester not found" };
//         }

//         moduleDetails[] modules = from moduleDetails md in moduleDetailsTable
//                                   where md.semesterId == (semesterRecord.toArray()[0]).id
//                                   select md;

//         json response = {
//             studentId: studentRecord.toArray()[0].studentId,
//             studentName: studentRecord.toArray()[0].studentName,
//             enrolledSemester: studentRecord.toArray()[0].enrolledSemester,
//             semester: semesterRecord.toArray()[0].semester,
//             noOfSubjects: semesterRecord.toArray()[0].noOfSubjects,
//             totalCredits: semesterRecord.toArray()[0].totalCredits,
//             modules: modules
//         };

//         return response;
//     }
// }



import ballerina/http;

type semesterDetails record {| 
    readonly int id; 
    string semester; 
    int noOfSubjects; 
    float totalCredits; 
|};

type moduleDetails record {| 
    readonly int id; 
    string moduleCode; 
    string moduleName; 
    float credits; 
    int semesterId; 
|};

type student record {| 
    readonly int id; 
    string studentId; 
    string studentName; 
    string enrolledSemester; 
|};

table<semesterDetails> key(id) semesterDetailsTable = table [
    {id: 1, semester: "L1S1", noOfSubjects: 6, totalCredits: 17.5},
    {id: 2, semester: "L1S2", noOfSubjects: 7, totalCredits: 19.5},
    {id: 3, semester: "L2S1", noOfSubjects: 6, totalCredits: 16.0},
    {id: 4, semester: "L2S2", noOfSubjects: 7, totalCredits: 20.0},
    {id: 5, semester: "L3S1", noOfSubjects: 9, totalCredits: 22.0},
    {id: 6, semester: "L3S2", noOfSubjects: 5, totalCredits: 20.0},
    {id: 7, semester: "L4S1", noOfSubjects: 5, totalCredits: 20.0},
    {id: 8, semester: "L4S2", noOfSubjects: 5, totalCredits: 20.0}
];

table<moduleDetails> key(id) moduleDetailsTable = table [
    {id: 1, moduleCode: "CM1111", moduleName: "Fundamentals of Mathematics", credits: 2.5, semesterId: 1},
    {id: 2, moduleCode: "IN1101", moduleName: "Programming Fundamentals", credits: 4.0, semesterId: 1},
    {id: 3, moduleCode: "IN1311", moduleName: "Digital System Design", credits: 3.0, semesterId: 1},
    {id: 4, moduleCode: "IN1321", moduleName: "Computer Organization", credits: 2.5, semesterId: 1},
    {id: 5, moduleCode: "IS1011", moduleName: "English", credits: 3.0, semesterId: 1},
    {id: 6, moduleCode: "CS1006", moduleName: "Software Engineering", credits: 4.0, semesterId: 2},
    {id: 7, moduleCode: "CS1007", moduleName: "Web Technologies", credits: 4.0, semesterId: 2},
    {id: 8, moduleCode: "CS1008", moduleName: "Mobile Application Development", credits: 4.0, semesterId: 2},
    {id: 9, moduleCode: "CS1009", moduleName: "Cloud Computing", credits: 4.0, semesterId: 2},
    {id: 10, moduleCode: "CS1010", moduleName: "Artificial Intelligence", credits: 4.0, semesterId: 2},
    {id: 11, moduleCode: "CS1011", moduleName: "Machine Learning", credits: 4.0, semesterId: 2},
    {id: 12, moduleCode: "CS1012", moduleName: "Cyber Security", credits: 4.0, semesterId: 2},
    {id: 13, moduleCode: "CS1013", moduleName: "Big Data", credits: 4.0, semesterId: 2},
    {id: 14, moduleCode: "CS1014", moduleName: "Software Architecture", credits: 4.0, semesterId: 3},
    {id: 15, moduleCode: "CS1015", moduleName: "Software Quality Assurance", credits: 4.0, semesterId: 3}
];

table<student> key(id) studentTable = table [
    {id: 1, studentId: "214001G", studentName: "John Doe", enrolledSemester: "L1S1"},
    {id: 2, studentId: "214003D", studentName: "Jane Doe", enrolledSemester: "L1S1"},
    {id: 3, studentId: "214002K", studentName: "John Smith", enrolledSemester: "L1S1"},
    {id: 4, studentId: "214004K", studentName: "Jane Smith", enrolledSemester: "L1S1"},
    {id: 5, studentId: "214005L", studentName: "John Doe", enrolledSemester: "L1S1"},
    {id: 6, studentId: "214006P", studentName: "Jane Doe", enrolledSemester: "L1S1"},
    {id: 7, studentId: "214007J", studentName: "John Smith", enrolledSemester: "L1S1"},
    {id: 8, studentId: "214008D", studentName: "Jane Smith", enrolledSemester: "L1S1"},
    {id: 9, studentId: "214009J", studentName: "John Doe", enrolledSemester: "L1S1"},
    {id: 10, studentId: "214010H", studentName: "Jane Doe", enrolledSemester: "L1S1"},
    {id: 11, studentId: "214011H", studentName: "John Smith", enrolledSemester: "L1S1"},
    {id: 12, studentId: "214012J", studentName: "Jane Smith", enrolledSemester: "L1S1"},
    {id: 13, studentId: "214013Y", studentName: "John Doe", enrolledSemester: "L1S1"},
    {id: 14, studentId: "214014H", studentName: "Jane Doe", enrolledSemester: "L1S1"},
    {id: 15, studentId: "214015J", studentName: "John Smith", enrolledSemester: "L1S1"}
];

service /university\-selection on new http:Listener(9090) {
    resource function get universitySelection/[string studentId]/[string semester]() returns json|error {
        student[] studentRecords = from student s in studentTable
                                   where s.studentId == studentId
                                   select s;

        if studentRecords.length() == 0 {
            return { "error": "Student not found" };
        }

        semesterDetails[] semesterRecords = from semesterDetails sd in semesterDetailsTable
                                            where sd.semester == semester
                                            select sd;

        if semesterRecords.length() == 0 {
            return { "error": "Semester not found" };
        }

        moduleDetails[] modules = from moduleDetails md in moduleDetailsTable
                                  where md.semesterId == semesterRecords[0].id
                                  select md;

        json response = {
            studentId: studentRecords[0].studentId,
            studentName: studentRecords[0].studentName,
            enrolledSemester: studentRecords[0].enrolledSemester,
            semester: semesterRecords[0].semester,
            noOfSubjects: semesterRecords[0].noOfSubjects,
            totalCredits: semesterRecords[0].totalCredits,
            modules: modules
        };

        return response;
    }
}