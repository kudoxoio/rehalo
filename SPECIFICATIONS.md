\# Sistema de Gestión para Clínicas de Fisioterapia

\## Especificación de módulos, requerimientos e innovación diferencial



\---



\## 1. Arquitectura general propuesta



Un sistema de este tipo suele dividirse en tres capas de valor:



\- \*\*Núcleo operativo\*\* (MVP): agenda, historia clínica, tratamiento, facturación.

\- \*\*Capa de experiencia del paciente\*\*: portal, telerehabilitación, comunicación.

\- \*\*Capa de inteligencia\*\*: IA clínica, automatización, analítica predictiva — aquí es donde un producto se diferencia de la competencia (Mediktor, TheraNest, WebPT, Clinicweb, etc.)



\---



\## 2. MÓDULOS DEL NÚCLEO (MVP)



\### 2.1 Gestión de pacientes / Expediente clínico (EMR)



\*\*Requerimientos funcionales:\*\*

\- Alta de paciente con datos demográficos, contacto de emergencia, seguro médico.

\- Historia clínica completa: antecedentes patológicos, quirúrgicos, farmacológicos, alergias.

\- Motivo de consulta y diagnóstico médico de referencia (ICD-10 / CIE-10).

\- Evaluación inicial estructurada: dolor (escala EVA/NPRS), rango de movimiento (goniometría), fuerza muscular (escala de Daniels), pruebas ortopédicas específicas.

\- Escalas validadas integradas: Oswestry, DASH, Lysholm, Berg, Tinetti, según especialidad.

\- Consentimientos informados digitales con firma electrónica.

\- Adjuntos: imágenes, estudios de imagenología, videos de evaluación de marcha/movimiento.

\- Historial cronológico tipo timeline (línea de tiempo clínica).

\- Control de versiones y auditoría de cambios (quién, cuándo, qué se modificó).



\*\*Requerimientos no funcionales:\*\*

\- Cifrado en reposo y en tránsito (AES-256 / TLS 1.3).

\- Cumplimiento normativo local (HIPAA en EE.UU., LFPDPPP en México, RGPD en UE) y trazabilidad de accesos.

\- Exportación en formato interoperable (HL7 FHIR) para referencias médicas.



\---



\### 2.2 Agenda y citas



\*\*Requerimientos funcionales:\*\*

\- Calendario multi-terapeuta y multi-sala/box de tratamiento.

\- Tipos de cita configurables (evaluación inicial, sesión de seguimiento, reevaluación).

\- Reglas de disponibilidad por terapeuta, especialidad y equipo requerido (ej. camilla de tracción, piscina).

\- Reserva online desde portal del paciente.

\- Lista de espera automática y reasignación ante cancelaciones.

\- Recordatorios automáticos (SMS/WhatsApp/email) con confirmación de asistencia.

\- Registro de inasistencias (no-show) y cancelaciones tardías con políticas configurables.

\- Bloqueo de horarios por mantenimiento de equipo o vacaciones del staff.



\---



\### 2.3 Plan de tratamiento y prescripción de ejercicio



\*\*Requerimientos funcionales:\*\*

\- Biblioteca de ejercicios con video/imagen, series, repeticiones, frecuencia, progresión.

\- Constructor de protocolos por patología (ej. protocolo post-quirúrgico LCA por fases).

\- Asignación de plan de ejercicios en casa (Home Exercise Program - HEP).

\- Objetivos terapéuticos medibles (SMART goals) con fecha estimada de alta.

\- Vinculación del plan con la evaluación inicial y el diagnóstico funcional.

\- Ajuste de progresión basado en la respuesta del paciente sesión a sesión.



\---



\### 2.4 Notas de evolución (SOAP) y seguimiento de sesión



\*\*Requerimientos funcionales:\*\*

\- Formato SOAP (Subjetivo, Objetivo, Análisis, Plan) o formato libre configurable.

\- Plantillas rápidas por patología para reducir tiempo de documentación.

\- Registro de intervención realizada (terapia manual, electroterapia, ejercicio terapéutico, etc.) con códigos de procedimiento (CPT si aplica).

\- Comparativa automática de métricas entre sesiones (dolor, ROM, fuerza) en gráficas.

\- Firma digital del terapeuta por sesión.

\- Alertas de "sesión sin nota pendiente" para cumplimiento administrativo.



\---



\### 2.5 Facturación, pagos y seguros



\*\*Requerimientos funcionales:\*\*

\- Generación de facturas/recibos por sesión o paquete de sesiones.

\- Gestión de paquetes prepagados y control de sesiones consumidas/restantes.

\- Múltiples métodos de pago (tarjeta, transferencia, efectivo, pasarelas como Stripe/MercadoPago).

\- Facturación a aseguradoras: códigos CPT/ICD, generación de reclamaciones (claims).

\- Seguimiento de estado de reclamación (enviada, aprobada, rechazada, en revisión).

\- Reportes de cuentas por cobrar y conciliación.

\- Facturación electrónica según normativa fiscal local (CFDI en México, etc.).



\---



\### 2.6 Gestión de personal / Fisioterapeutas



\*\*Requerimientos funcionales:\*\*

\- Perfiles con especialidad, cédula profesional, certificaciones y vencimientos.

\- Control de horarios, turnos y carga de pacientes por terapeuta.

\- Métricas de desempeño (pacientes atendidos, tasa de alta exitosa, ocupación de agenda).

\- Roles y permisos granulares (administrador, terapeuta, recepción, facturación).



\---



\### 2.7 Inventario y equipamiento



\*\*Requerimientos funcionales:\*\*

\- Catálogo de equipos (TENS, ultrasonido, camillas, bandas, pesas).

\- Mantenimiento preventivo con alertas por fecha o uso.

\- Control de insumos consumibles (electrodos, gel, vendas).

\- Asociación de equipo a box/sala para bloqueo automático en agenda.



\---



\### 2.8 Comunicación y portal del paciente



\*\*Requerimientos funcionales:\*\*

\- App/portal web para el paciente: ver citas, plan de ejercicios, progreso, facturas.

\- Mensajería segura terapeuta-paciente.

\- Encuestas de satisfacción (NPS) post-alta.

\- Notificaciones push para recordatorio de ejercicios en casa.



\---



\### 2.9 Reportes y analítica administrativa



\*\*Requerimientos funcionales:\*\*

\- Dashboard de ocupación, ingresos, pacientes nuevos vs. recurrentes.

\- Tasa de abandono (dropout) y de conversión de evaluación a tratamiento.

\- Reportes por terapeuta, por patología, por fuente de referencia (médico que refiere).

\- Exportación a Excel/PDF.



\---



\### 2.10 Cumplimiento normativo y seguridad



\*\*Requerimientos funcionales:\*\*

\- Consentimientos y avisos de privacidad versionados.

\- Bitácora de auditoría (logs) de accesos a expedientes.

\- Política de retención y eliminación de datos.

\- Copias de seguridad automáticas y plan de recuperación ante desastres.



\---



\## 3. MÓDULOS PARA SIGUIENTE ITERACIÓN (Fase 2)



Estos no son indispensables en el MVP pero elevan mucho la propuesta de valor:



1\. \*\*Telerehabilitación\*\*: videollamada integrada, evaluación remota guiada, biofeedback en vivo.

2\. \*\*Multi-sede / franquicias\*\*: gestión centralizada con reportes consolidados y agenda independiente por sede.

3\. \*\*Gestión de referidos médicos\*\*: portal para médicos externos que refieren pacientes, con reporte automático de evolución.

4\. \*\*Marketplace de contenido\*\*: biblioteca de protocolos clínicos compartida/validada entre clínicas de la misma red.

5\. \*\*Módulo de investigación clínica\*\*: recolección estructurada de datos anonimizados para estudios o mejora de protocolos.

6\. \*\*Integración con wearables e IoT\*\*: bandas de frecuencia cardiaca, sensores inerciales (IMU), plataformas de fuerza, electrogoniómetros digitales.

7\. \*\*Gamificación\*\*: puntos, insignias y retos para mejorar adherencia al HEP (Home Exercise Program).

8\. \*\*Marketplace de citas B2C\*\*: descubrimiento de clínicas por especialidad/ubicación, tipo "Doctoralia" especializado en rehabilitación.



\---



\## 4. DIFERENCIADORES: IA, AGENTES Y AUTOMATIZACIÓN



Esta es la capa donde un sistema puede destacar claramente sobre WebPT, Clinicweb, TheraNest o similares. Los fisios pierden más tiempo en \*\*documentación\*\* y \*\*adherencia del paciente\*\* que en cualquier otra cosa — ahí está la oportunidad.



\### 4.1 Copiloto de documentación clínica (mayor ROI inmediato)

\- \*\*Dictado por voz → nota SOAP estructurada automáticamente\*\*: el terapeuta narra la sesión en lenguaje natural mientras atiende, y un modelo transcribe y estructura la nota en formato SOAP, sugiriendo códigos de procedimiento.

\- Reduce el tiempo de documentación (que hoy consume 20-30% de la jornada) a minutos.

\- Detección de inconsistencias: si la nota no coincide con el plan de tratamiento vigente, el sistema alerta al terapeuta antes de firmar.



\### 4.2 Análisis de movimiento por visión por computadora

\- Uso de la cámara del móvil/tablet para estimar ángulos articulares y calidad de movimiento (pose estimation) durante ejercicios, sin necesidad de sensores físicos.

\- Comparación automática entre el rango de movimiento del lado sano vs. el lesionado.

\- En el HEP: el paciente graba su ejercicio en casa y el sistema da retroalimentación automática sobre técnica (ej. "rodilla colapsando hacia adentro en sentadilla") y alerta al fisio si detecta un patrón de riesgo.



\### 4.3 Agente de adherencia y seguimiento proactivo

\- Agente que monitorea si el paciente completó su HEP, y si no, envía recordatorios personalizados y escalados (suave → firme → alerta al terapeuta).

\- Predicción de riesgo de abandono (dropout) basada en patrones históricos (asistencia, dolor reportado, mensajes no respondidos) para que el terapeuta intervenga antes de perder al paciente.

\- Alertas de "falta de progreso esperado" comparando la evolución real contra la curva típica de esa patología, sugiriendo reevaluación o cambio de protocolo.



\### 4.4 Generador de planes de tratamiento asistido por IA (con supervisión clínica)

\- A partir del diagnóstico, evaluación funcional y guías de práctica clínica basadas en evidencia (RAG sobre literatura fisioterapéutica), el sistema sugiere un protocolo inicial editable — el fisio siempre valida y ajusta, nunca sustituye el criterio clínico.

\- Útil especialmente para terapeutas junior o casos poco frecuentes.



\### 4.5 Automatización administrativa

\- Agente que gestiona el ciclo de reclamaciones a aseguradoras: llena formularios, detecta códigos faltantes o inconsistentes antes de enviar, y da seguimiento automático al estado.

\- Optimización automática de agenda: reordena huecos por cancelaciones, sugiere el mejor horario según preferencias históricas del paciente y del terapeuta.

\- Resumen automático semanal para cada terapeuta: pacientes en riesgo de abandono, notas pendientes, próximas altas.



\### 4.6 Asistente conversacional para pacientes

\- Chatbot integrado en el portal/WhatsApp que responde dudas frecuentes ("¿puedo hacer ejercicio si me duele?"), agenda/reagenda citas, y \*\*escala a un humano\*\* ante cualquier señal de dolor agudo, síntomas de alarma (banderas rojas) o duda clínica compleja — nunca da diagnóstico.



\### 4.7 Analítica predictiva a nivel clínica

\- Predicción de duración estimada de tratamiento y número de sesiones según patología y perfil del paciente, útil para planificación de capacidad y pricing de paquetes.

\- Detección de patrones agregados: qué protocolos tienen mejor tasa de éxito por terapeuta, útil para estandarizar buenas prácticas internamente.



\---



\## 5. Consideraciones clave de diseño para estas funciones de IA



\- \*\*El fisio siempre tiene la última palabra\*\*: ningún módulo de IA debe generar diagnóstico o modificar el plan sin validación humana explícita — esto es tanto un requisito ético como regulatorio.

\- \*\*Explicabilidad\*\*: cuando el sistema sugiere algo (protocolo, alerta de riesgo), debe mostrar en qué datos se basa.

\- \*\*Consentimiento para uso de cámara/video\*\*: el análisis de movimiento requiere consentimiento explícito y idealmente procesamiento on-device o con borrado inmediato del video crudo.

\- \*\*Curva de adopción\*\*: lanzar el copiloto de documentación primero (dolor más agudo y menos resistencia a la adopción), y dejar el análisis de movimiento y agentes predictivos para cuando haya suficientes datos históricos propios.



\---



\## 6. Resumen de priorización sugerida



| Fase | Módulos | Objetivo |

|---|---|---|

| MVP | 2.1 a 2.10 | Operar la clínica de forma completa |

| Fase 2 | Telerehab, multi-sede, referidos, wearables | Escalar y diferenciarse operativamente |

| Fase 3 (IA) | Copiloto de notas, visión por computadora, agente de adherencia, generador de protocolos | Diferenciación real frente a la competencia |

