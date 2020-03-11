export interface ApplicantForm {
    id?: number;
    userImageContentType?: string;
    userImage?: any;
    name?: string;
    email?: string;
    recevierEmail?: string;
    phone?: string;
    address?: string;
    gender?: string;
    placeOfBirth?: string;
    dateOfBirth?: Date;
    visaDetails?: string;
    citizenship?: string;
    resumeContentType?: string;
    resume?: any;
    employeeApplication?: boolean;
    employeeOrientation?: boolean;
    employeeIdentification?: boolean;
    securityClearance?: boolean;
    medicalClearance?: boolean;
    employeeWellness?: boolean;
    emergencyContact?: boolean;
    checkEmail: string;
  }
  
  export class ApplicantForm implements ApplicantForm {
    constructor(
      public id?: number,
      public userImageContentType?: string,
      public userImage?: any,
      public name?: string,
      public email?: string,
      public recevierEmail?: string,
      public phone?: string,
      public address?: string,
      public gender?: string,
      public placeOfBirth?: string,
      public dateOfBirth?: Date,
      public visaDetails?: string,
      public citizenship?: string,
      public resumeContentType?: string,
      public resume?: any,
      public employeeApplication?: boolean,
      public employeeOrientation?: boolean,
      public employeeIdentification?: boolean,
      public securityClearance?: boolean,
      public medicalClearance?: boolean,
      public employeeWellness?: boolean,
      public emergencyContact?: boolean
    ) {
      this.employeeApplication = this.employeeApplication || false;
      this.employeeOrientation = this.employeeOrientation || false;
      this.employeeIdentification = this.employeeIdentification || false;
      this.securityClearance = this.securityClearance || false;
      this.medicalClearance = this.medicalClearance || false;
      this.employeeWellness = this.employeeWellness || false;
      this.emergencyContact = this.emergencyContact || false;
    }
  }
  