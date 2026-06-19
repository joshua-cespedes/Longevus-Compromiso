import { useState, useEffect } from "react"
import type { FormData } from "../../components/VisitorForms"
import ResidentSelector from "../../components/AppoitmentResidentSelector"
import type { Resident } from "../../components/AppoitmentResidentSelector"
import TimeSelector from "../../components/AppoitmentTimeSelector"
import VisitorForm from "../../components/VisitorForms"
import AppointmentSummary from "../../components/AppointmentSummaryCard"
import ConfirmationScreen from "../../components/AppoitmentConfirmationCard"
import DateSelector from "../../components/AppoitmentDateSelector"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import { getResidents, addVisit, type VisitPayload, type ApiResident } from "../../services/VisitService"
import { succesAlert } from "../../js/alerts"
import { useNavigate } from "react-router-dom"

const AppointmentScheduler = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [allResidentOptions, setAllResidentOptions] = useState<Resident[]>([]);
  const [isLoadingResidents, setIsLoadingResidents] = useState(true);
  const [errorResidents, setErrorResidents] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    resident: "",
    name: "",
    email: "",
    phone: "",
    relationship: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  useEffect(() => {
    const loadResidents = async () => {
      try {
        setIsLoadingResidents(true); 
        setErrorResidents(null);
        const data: ApiResident[] = await getResidents(); 
         
        //console.log("Residentes obtenidos:", data);

        const formattedOptions: Resident[] = data.map(resident => ({
          value: `hab${resident.numberRoom}-${resident.id}`, 
          label: `Hab: ${resident.numberRoom} - ${resident.name}`
        }));

        setAllResidentOptions(formattedOptions);
      } catch (err) {
        console.error("Error al cargar residentes en AppointmentScheduler:", err);
        setErrorResidents("No se pudieron cargar los datos de los residentes. Intente más tarde.");
      } finally {
        setIsLoadingResidents(false);
      }
    };

    loadResidents();
  }, []);
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!isFormValid) {
      return
    }


    const residentIdString = formData.resident.split('-')[1];
    const residentId = parseInt(residentIdString, 10);
    
    const visitToSave: VisitPayload = {
      name: formData.name,
      visitDate: selectedDate,
      visitHour: selectedTime + ":00",
      phoneNumber: formData.phone,
      email: formData.email,
      relationship: formData.relationship,
      resident: {
        id: residentId,
      },
    };

    try {
      console.log("Informacion que se manda " , visitToSave);
      const successMessage = await addVisit(visitToSave);
      succesAlert("Visita Agendada", successMessage);
      setIsSubmitted(true); 
    } catch (error) {
      console.error("Fallo al enviar la visita:", error);
    }
  }

  const isFormValid =
    selectedDate && selectedTime && formData.resident &&
    formData.name && formData.email && formData.relationship

  if (isSubmitted) {
    navigate("/")
  }

  return (
    <>
      <Header />
      <div className="min-vh-100" style={{ background: "#ffffff" }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-dark mb-3">Agendar Visita</h1>
            <p className="lead text-muted">Selecciona el residente, fecha y hora que mejor te convenga</p>
          </div>
          <div className="row g-4">

            <div className="col-12">
              <ResidentSelector
                residents={allResidentOptions}
                selectedResident={formData.resident}
                onResidentChange={(value) => handleInputChange("resident", value)}
              />
            </div>

            <div className="col-lg-12">
              <DateSelector selectedResident={formData.resident} selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </div>

            <div className="col-lg-12">
              <TimeSelector selectedTime={selectedTime} selectedDate={selectedDate} onTimeChange={setSelectedTime} />
            </div>

            <div className="col-12">
              <VisitorForm formData={formData} onInputChange={handleInputChange} />
            </div>

            <div className="col-12">
              <AppointmentSummary
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                formData={formData}
                onSubmit={handleSubmit}
                isFormValid={!!isFormValid}
                residentOptions={allResidentOptions}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
export default AppointmentScheduler;