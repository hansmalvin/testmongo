const app = angular.module('studentApp', []);

app.controller('StudentController', function ($scope, $http) {
  const apiBase = 'http://localhost:3000/students';

  $scope.students = [];
  $scope.filteredStudents = [];
  $scope.student = {};
  $scope.sortOrder = 'name'; // Default sort order (A-Z)
  $scope.editMode = false;

  // Fetch all students
  const loadStudents = () => {
    $http.get(apiBase).then((response) => {
      $scope.students = response.data;
      $scope.sortStudents(); // Apply initial sorting
    });
  };

  // Sort students based on sortOrder
  $scope.sortStudents = () => {
    const order = $scope.sortOrder === 'name' ? 1 : -1; // 1 for A-Z, -1 for Z-A
    $scope.filteredStudents = [...$scope.students].sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -order;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return order;
      return 0;
    });
  };

  // Save student (Add or Update)
  $scope.saveStudent = () => {
    if ($scope.editMode) {
      // Update existing student
      $http.put(`${apiBase}/${$scope.student._id}`, $scope.student).then(() => {
        $scope.student = {};
        $scope.editMode = false;
        loadStudents();
      });
    } else {
      // Add new student
      $http.post(apiBase, $scope.student).then(() => {
        $scope.student = {};
        loadStudents();
      });
    }
  };

  // Edit a student
  $scope.editStudent = (student) => {
    $scope.student = angular.copy(student);
    $scope.editMode = true;
  };

  // Delete a student
  $scope.deleteStudent = (id) => {
    $http.delete(`${apiBase}/${id}`).then(() => {
      loadStudents();
    });
  };

  loadStudents();
});
