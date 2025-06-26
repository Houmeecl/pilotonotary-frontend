import { Crown, Stamp, Store, User, Handshake, UserCog, IdCard, File, Play, Info, CheckCircle, ShieldHalf, Smile, Signature, CreditCard, Database, Bot, FilePlus, FileText, QrCode, Download, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-trust-gray">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-chile-red rounded-lg flex items-center justify-center">
                <IdCard className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-trust-gray">NotaryPro</h1>
                <p className="text-xs text-gray-500">+ VecinoXpress</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection("servicios")}
                className="text-gray-600 hover:text-chile-red transition-colors"
              >
                Servicios
              </button>
              <button 
                onClick={() => scrollToSection("como-funciona")}
                className="text-gray-600 hover:text-chile-red transition-colors"
              >
                Cómo Funciona
              </button>
              <button 
                onClick={() => scrollToSection("acceso")}
                className="text-gray-600 hover:text-chile-red transition-colors"
              >
                Acceso
              </button>
              <Button className="bg-chile-red hover:bg-red-700">
                Soporte
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative chile-gradient text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 text-sm">
                  <ShieldHalf className="mr-2" size={16} />
                  Conforme a Ley N° 19.799 - Documentos Electrónicos
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Certificación <span className="text-red-300">Digital Legal</span> para Todos
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  La primera red nacional de certificación electrónica ciudadana. 
                  Documentos legales válidos desde tu barrio o 100% online.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-chile-red hover:bg-red-700 text-lg px-8 py-4 transform hover:scale-105 transition-all"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <Play className="mr-2" size={20} />
                  Empezar Ahora
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-chile-blue text-lg px-8 py-4"
                  onClick={() => scrollToSection("como-funciona")}
                >
                  <Info className="mr-2" size={20} />
                  Conocer Más
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="text-green-300 mr-2" size={16} />
                  Firma Electrónica Avanzada
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-300 mr-2" size={16} />
                  Validación de Identidad
                </div>
              </div>
            </div>
            <div className="lg:block">
              <img 
                src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Tecnología legal digital profesional" 
                className="rounded-2xl shadow-2xl w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Role Access Portals */}
      <section id="acceso" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-trust-gray mb-4">
              Acceso por Perfil de Usuario
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada usuario tiene su panel especializado con funciones específicas para su rol en el ecosistema NotaryPro.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Superadmin Portal */}
            <Card className="role-superadmin transform hover:scale-105 transition-all shadow-lg">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto">
                  <Crown size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Superadmin</h3>
                  <p className="text-red-100 mb-6">Control total del sistema y análisis de datos</p>
                </div>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Dashboard de estadísticas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Gestión de usuarios
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Gestión financiera
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Agente IA inteligente
                  </li>
                </ul>
                <Button 
                  className="w-full bg-white text-chile-red hover:bg-gray-100"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>

            {/* Certificador Portal */}
            <Card className="role-certificador transform hover:scale-105 transition-all shadow-lg">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto">
                  <Stamp size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Certificador</h3>
                  <p className="text-blue-100 mb-6">Panel de revisión y firma electrónica avanzada</p>
                </div>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Documentos pendientes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Firma electrónica avanzada
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Historial de certificaciones
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Autenticación segura
                  </li>
                </ul>
                <Button 
                  className="w-full bg-white text-chile-blue hover:bg-gray-100"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>

            {/* Vecino/Almacén Portal */}
            <Card className="role-vecino transform hover:scale-105 transition-all shadow-lg">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto">
                  <Store size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Vecino/Almacén</h3>
                  <p className="text-green-100 mb-6">Terminal POS para venta de documentos</p>
                </div>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Terminal POS intuitivo
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Comisiones automáticas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Reportes de ventas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Red de colaboradores
                  </li>
                </ul>
                <Button 
                  className="w-full bg-white text-green-600 hover:bg-gray-100"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>

            {/* Usuario Final Portal */}
            <Card className="role-usuario transform hover:scale-105 transition-all shadow-lg">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Usuario Final</h3>
                  <p className="text-purple-100 mb-6">Gestiona tus documentos certificados</p>
                </div>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Mis documentos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Descargar certificados
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Códigos de validación
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Notificaciones
                  </li>
                </ul>
                <Button 
                  className="w-full bg-white text-purple-600 hover:bg-gray-100"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>

            {/* Socios/Partners Portal */}
            <Card className="role-socios transform hover:scale-105 transition-all shadow-lg">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto">
                  <Handshake size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Socios/Partners</h3>
                  <p className="text-orange-100 mb-6">Panel de colaboración empresarial</p>
                </div>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Red de alianzas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Métricas de colaboración
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Facturación conjunta
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Proyectos especiales
                  </li>
                </ul>
                <Button 
                  className="w-full bg-white text-orange-600 hover:bg-gray-100"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>

            {/* RRHH Portal */}
            <Card className="role-rrhh transform hover:scale-105 transition-all shadow-lg">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto">
                  <UserCog size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Recursos Humanos</h3>
                  <p className="text-teal-100 mb-6">Gestión de personal y onboarding</p>
                </div>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Onboarding colaboradores
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Métricas de desempeño
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Capacitación
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2" size={16} /> Gestión de horarios
                  </li>
                </ul>
                <Button 
                  className="w-full bg-white text-teal-600 hover:bg-gray-100"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Document Services Section */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-trust-gray mb-4">
              Documentos Legales Disponibles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Amplio catálogo de documentos legales con certificación digital válida según la normativa chilena.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="dashboard-card">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                  <File className="text-2xl text-chile-blue" size={32} />
                </div>
                <h3 className="text-xl font-bold">Declaraciones Juradas</h3>
                <p className="text-gray-600">Certificación de declaraciones con validez legal completa</p>
                <div className="border-t pt-4">
                  <span className="text-2xl font-bold text-chile-red">$12.000</span>
                  <span className="text-gray-500 ml-2">CLP</span>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Handshake className="text-2xl text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold">Finiquitos Laborales</h3>
                <p className="text-gray-600">Documentos de término de relación laboral certificados</p>
                <div className="border-t pt-4">
                  <span className="text-2xl font-bold text-chile-red">$18.000</span>
                  <span className="text-gray-500 ml-2">CLP</span>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                  <FileText className="text-2xl text-purple-600" size={32} />
                </div>
                <h3 className="text-xl font-bold">Contratos Simples</h3>
                <p className="text-gray-600">Acuerdos contractuales con firma electrónica avanzada</p>
                <div className="border-t pt-4">
                  <span className="text-2xl font-bold text-chile-red">$25.000</span>
                  <span className="text-gray-500 ml-2">CLP</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Process Demo Section */}
          <Card className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-8">Demostración del Proceso POS</h3>
            
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-chile-red text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">1</div>
                <h4 className="font-semibold">Selección de Documento</h4>
                <p className="text-gray-600 text-sm">El usuario selecciona el tipo de documento desde el menú del terminal POS</p>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                  alt="Interfaz de selección de documentos en tablet" 
                  className="rounded-lg mx-auto w-full h-32 object-cover" 
                />
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-chile-blue text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">2</div>
                <h4 className="font-semibold">Ingreso de Datos</h4>
                <p className="text-gray-600 text-sm">Formulario guiado paso a paso para completar la información requerida</p>
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                  alt="Persona completando formularios legales en dispositivo digital" 
                  className="rounded-lg mx-auto w-full h-32 object-cover" 
                />
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">3</div>
                <h4 className="font-semibold">Verificación de Identidad</h4>
                <p className="text-gray-600 text-sm">Escaneo QR → móvil → FaceID y validación de cédula de identidad</p>
                <img 
                  src="https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                  alt="Persona chilena usando tecnología de reconocimiento facial para verificación de identidad" 
                  className="rounded-lg mx-auto w-full h-32 object-cover" 
                />
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">4</div>
                <h4 className="font-semibold">Certificación Digital</h4>
                <p className="text-gray-600 text-sm">Firma electrónica del certificador y entrega del documento con QR de validación</p>
                <img 
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                  alt="Proceso de firma digital y certificación de documentos legales" 
                  className="rounded-lg mx-auto w-full h-32 object-cover" 
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-trust-gray mb-4">
              Cómo Funciona el Ecosistema
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una red colaborativa que conecta almacenes de barrio, certificadores legales y ciudadanos.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-chile-red text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Venta en Punto Físico</h3>
                  <p className="text-gray-600">El vecino (almacén) utiliza el terminal POS para vender documentos legales como un producto más. Sistema de autoservicio guiado.</p>
                  <div className="flex items-center mt-2 text-sm text-chile-red">
                    <User className="mr-2" size={16} />
                    Participan: Vecino (Almacén) + Usuario Final
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-chile-blue text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Envío para Certificación</h3>
                  <p className="text-gray-600">El documento completado se envía automáticamente al panel del certificador autorizado para revisión y firma electrónica avanzada.</p>
                  <div className="flex items-center mt-2 text-sm text-chile-blue">
                    <CheckCircle className="mr-2" size={16} />
                    Sistema → Panel del Certificador
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Certificación y Firma</h3>
                  <p className="text-gray-600">El certificador revisa, aprueba y firma electrónicamente el documento utilizando su token de firma electrónica avanzada (FEA).</p>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <IdCard className="mr-2" size={16} />
                    Validez legal completa
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">4</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Entrega y Comisiones</h3>
                  <p className="text-gray-600">Documento PDF enviado por correo/WhatsApp con QR de validación. Comisiones automáticas distribuidas entre todos los participantes.</p>
                  <div className="flex items-center mt-2 text-sm text-purple-600">
                    <CheckCircle className="mr-2" size={16} />
                    Vecino, Certificador, Administración
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <img 
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Comunidad empresarial chilena e integración de tecnología legal" 
                className="rounded-2xl shadow-xl w-full h-auto" 
              />

              <Card className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-center">Distribución de Comisiones</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      <span>Vecino (Almacén)</span>
                    </div>
                    <span className="font-semibold">40%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-chile-blue rounded-full mr-3"></div>
                      <span>Certificador</span>
                    </div>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-chile-red rounded-full mr-3"></div>
                      <span>Administración</span>
                    </div>
                    <span className="font-semibold">25%</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Integration Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-trust-gray mb-4">
              Integraciones Tecnológicas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnologías de vanguardia para garantizar seguridad, validez legal y facilidad de uso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <Card className="dashboard-card text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <Smile className="text-2xl text-blue-600" size={32} />
              </div>
              <h3 className="font-semibold">FaceIO</h3>
              <p className="text-gray-600 text-sm">Verificación biométrica facial para autenticación segura</p>
              <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                Integrado
              </div>
            </Card>

            <Card className="dashboard-card text-center space-y-4">
              <div className="w-16 h-16 bg-chile-red bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto">
                <Signature className="text-2xl text-chile-red" size={32} />
              </div>
              <h3 className="font-semibold">FirmaDigital.cl</h3>
              <p className="text-gray-600 text-sm">Firma electrónica avanzada certificada en Chile</p>
              <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                Integrado
              </div>
            </Card>

            <Card className="dashboard-card text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <CreditCard className="text-2xl text-blue-600" size={32} />
              </div>
              <h3 className="font-semibold">MercadoPago</h3>
              <p className="text-gray-600 text-sm">Pasarela de pagos segura para transacciones POS</p>
              <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                Integrado
              </div>
            </Card>

            <Card className="dashboard-card text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <Database className="text-2xl text-purple-600" size={32} />
              </div>
              <h3 className="font-semibold">PostgreSQL</h3>
              <p className="text-gray-600 text-sm">Base de datos robusta para gestión empresarial</p>
              <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                Implementado
              </div>
            </Card>
          </div>

          {/* AI Agent Feature Highlight */}
          <Card className="bg-gradient-to-r from-chile-red to-red-700 text-white rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Bot size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Agente IA Inteligente</h3>
                </div>
                <p className="text-red-100 text-lg">
                  Nuestro agente de inteligencia artificial analiza datos en tiempo real para optimizar operaciones y recomendar estrategias de crecimiento.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-3" size={16} />
                    Resumen diario de operaciones
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3" size={16} />
                    Estrategias de expansión territorial
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3" size={16} />
                    Optimización de precios dinámicos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-3" size={16} />
                    Identificación de oportunidades municipales
                  </li>
                </ul>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Tecnología de firma digital e inteligencia artificial" 
                  className="rounded-2xl shadow-2xl w-full h-auto" 
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Legal Compliance and Footer */}
      <section className="py-20 trust-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Cumplimiento Legal y Normativo</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="text-lg leading-relaxed">
                    Este sistema cumple con la <strong>Ley N° 19.799 sobre Documentos Electrónicos y Firma Electrónica de Chile</strong>. 
                    Todos los documentos generados son legalmente válidos bajo las normativas vigentes, firmados por certificadores autorizados.
                  </p>
                  <p className="leading-relaxed">
                    NotaryPro no es una notaría ni reemplaza funciones notariales, sino que actúa como certificador digital conforme a la ley. 
                    Nuestros procesos garantizan la integridad, autenticidad y no repudio de los documentos certificados.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Certificaciones</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <ShieldHalf className="mr-3 text-green-400" size={16} />
                      ISO 27001 - Seguridad de la Información
                    </li>
                    <li className="flex items-center">
                      <IdCard className="mr-3 text-blue-400" size={16} />
                      Firma Electrónica Avanzada Certificada
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 text-green-400" size={16} />
                      Cumplimiento GDPR y Protección de Datos
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Contacto Legal</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <Mail className="inline mr-3" size={16} />
                      legal@notarypro.cl
                    </p>
                    <p>
                      <CheckCircle className="inline mr-3" size={16} />
                      +56 2 2345 6789
                    </p>
                    <p>
                      <CheckCircle className="inline mr-3" size={16} />
                      Santiago, Chile
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <Card className="bg-white bg-opacity-10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Enlaces Rápidos</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Términos y Condiciones</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Privacidad</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Manual de Usuario</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Preguntas Frecuentes</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Centro de Ayuda</a></li>
                </ul>
              </Card>

              <img 
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="Documentos legales chilenos y documentación gubernamental oficial" 
                className="rounded-2xl shadow-xl w-full h-auto opacity-80" 
              />
            </div>
          </div>

          <div className="border-t border-gray-600 mt-12 pt-8 text-center text-gray-400">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-chile-red rounded-lg flex items-center justify-center">
                  <IdCard className="text-white" size={16} />
                </div>
                <span>&copy; 2024 NotaryPro + VecinoXpress. Todos los derechos reservados.</span>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="hover:text-white transition-colors">
                  <CheckCircle size={20} />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <CheckCircle size={20} />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <CheckCircle size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
