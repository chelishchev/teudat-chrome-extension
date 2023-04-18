export default class AutoSelectDepartment {
    constructor(id, {departments, xhrSubstitute, backendService}) {
        this.desiredDepartmentId = id;
        /** @type {Departments} */
        this.departments = departments;
        /** @type {XhrSubstitute} */
        this.xhrSubstitute = xhrSubstitute;
        /** @type {BackendService} */
        this.backendService = backendService;

        this.xhrSubstitute.addHandler('https://central.myvisit.com/CentralAPI/AppointmentSet', (url, response) => {
            this.handleAppointmentSetResponse(url, JSON.parse(response));
        });
        this.xhrSubstitute.addHandler('https://piba-api.myvisit.com/CentralAPI/AppointmentSet', (url, response) => {
            this.handleAppointmentSetResponse(url, JSON.parse(response));
        });
    }

    helpPeopleToSelectDesiredDepartment() {
        this.departments.clickOnDepartment(this.desiredDepartmentId);
    }

    handleAppointmentSetResponse(queryUrl, response) {
        if (!response.Success) {
            return;
        }
        if (response.Results?.ServiceId == this.desiredDepartmentId) {
            const departmentInfo = this.departments.getDepartmentById(this.desiredDepartmentId);
            this.backendService.notify('appointmentGot', {
                department: {
                    serviceId: departmentInfo.ServiceId,
                    name: departmentInfo.Label,
                },
                date: response.Results.ReferenceDate,
            })
        }
    }
}