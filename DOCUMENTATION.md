
# Documentación del Asente Socrático

**Versión:** 1.0
**Desarrollado por:** Jefatura de Analítica Institucional - Dirección de Desarrollo Estratégico

---

## 1. Introducción

El **Asistente Socrático** es una herramienta de chat interactiva diseñada para guiar a directivos y gerentes en un proceso estructurado de análisis y documentación de sus unidades organizacionales. Utilizando el método socrático, la aplicación facilita una reflexión profunda sobre la identidad, propósito, procesos y contribución estratégica de la unidad, culminando en la generación de entregables documentales.

## 2. Arquitectura y Stack Tecnológico

La aplicación es una Single Page Application (SPA) construida con tecnologías modernas del lado del cliente. No requiere un backend propio, ya que consume directamente la API de Google Gemini para la lógica conversacional.

-   **Framework Frontend:** [React](https://react.dev/) (v18.2.0)
-   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (cargado vía CDN)
-   **Inteligencia Artificial:** [Google Gemini API](https://ai.google.dev/) (a través del SDK `@google/genai`)
-   **Reconocimiento de Voz:** [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) (nativa del navegador)
-   **Renderizado de Markdown:** [Marked](https://marked.js.org/)
-   **Carga de Módulos:** ES Modules nativos con `importmap` para la gestión de dependencias sin un `bundler`.

## 3. Estructura del Proyecto

El proyecto está organizado en una estructura clara y modular para facilitar su mantenimiento.

```
.
├── components/
│   ├── ChatMessage.tsx       # Renderiza una única burbuja de chat (usuario o AI).
│   ├── ChatWindow.tsx        # Contenedor de la conversación, maneja el scroll.
│   ├── InputArea.tsx         # Área de texto para la entrada del usuario y botones de acción (enviar, subir, grabar voz).
│   ├── PhaseBanner.tsx       # Banner superior que muestra la fase actual del análisis.
│   ├── icons.tsx             # Componentes SVG para los íconos de la UI.
│   └── PhaseTracker.tsx      # (No utilizado actualmente) Componente de barra lateral para seguir las fases.
├── services/
│   └── geminiService.ts      # Módulo para la comunicación con la API de Google Gemini.
├── App.tsx                   # Componente principal que gestiona el estado y la lógica de la aplicación.
├── constants.ts              # Almacena constantes, como el system prompt de la IA y textos de la UI.
├── index.html                # Punto de entrada HTML, define el importmap y carga los scripts.
├── index.tsx                 # Punto de entrada de React, monta el componente App en el DOM.
├── types.ts                  # Define las interfaces y tipos de TypeScript compartidos.
└── metadata.json             # Metadatos de la aplicación y permisos (ej. micrófono).
```

### Descripción de Archivos Clave

-   **`App.tsx`**: Es el cerebro de la aplicación. Gestiona el estado global, incluyendo el historial de la conversación (`conversation`), la fase actual del análisis (`currentPhase`), el estado de carga (`isLoading`), y la entrada del usuario. Orquesta las llamadas a la API y la actualización de la UI.

-   **`services/geminiService.ts`**: Abstrae toda la lógica de interacción con la API de Gemini. Inicializa el cliente de la IA, formatea el historial de la conversación para la API, y construye el prompt que se envía al modelo, enriqueciéndolo con el contexto actual (fase, archivos, datos previos).

-   **`components/InputArea.tsx`**: Además de la entrada de texto y carga de archivos, ahora contiene la lógica para la entrada de voz, gestionando el estado de grabación y la comunicación con la Web Speech API.

-   **`constants.ts`**: Contiene el `SOCRATIC_SYSTEM_PROMPT`, que es la directiva principal que define la personalidad, el rol y el flujo de conversación de la IA. También contiene los textos para el `PhaseBanner`. Centralizar estos textos facilita su modificación.

-   **`types.ts`**: Proporciona seguridad de tipos en todo el proyecto. El `enum Phase` es fundamental para controlar el flujo del análisis.

-   **`index.html`**: Utiliza un `importmap` para declarar las dependencias de JavaScript. Esto permite usar importaciones de módulos ES6 directamente en el navegador sin necesidad de un paso de compilación (bundling) con herramientas como Webpack o Vite.

## 4. Flujo de Datos y Lógica

El flujo de la aplicación es unidireccional y está centrado en el estado gestionado por el componente `App.tsx`.

1.  **Inicialización**:
    -   `index.tsx` monta el componente `App`.
    -   El `useEffect` en `App.tsx` se dispara una sola vez, llamando a `processAiResponse` con un prompt inicial para que la IA envíe el mensaje de bienvenida.

2.  **Interacción del Usuario (Texto)**:
    -   El usuario escribe un mensaje en el componente `InputArea`.
    -   Al enviar, se llama a la función `handleSendMessage` en `App.tsx`.

3.  **Interacción del Usuario (Voz)**:
    -   El usuario puede hacer clic en el ícono del micrófono en el `InputArea` para iniciar el reconocimiento de voz.
    -   El navegador solicitará permiso para usar el micrófono (la primera vez).
    -   Mientras el asistente escucha, el texto transcrito aparece en tiempo real en el área de entrada.
    -   Cuando el usuario deja de hablar o hace clic de nuevo en el ícono, la grabación se detiene y la transcripción más reciente disponible se pasa a la función `handleSendMessage`, siguiendo el mismo flujo que un mensaje de texto.
    -   Esta funcionalidad se maneja localmente en el navegador usando la Web Speech API.

4.  **Procesamiento de la IA**:
    -   `handleSendMessage` actualiza el estado `conversation` con el mensaje del usuario.
    -   Inmediatamente después, llama a `processAiResponse`.
    -   `processAiResponse` construye un `fullPrompt` que incluye el contexto actual (fase, historial, archivos) y el último mensaje del usuario.
    -   Este `fullPrompt` se pasa a `getNextResponse` en `geminiService.ts`.
    -   El servicio envía la solicitud a la API de Gemini.

5.  **Actualización de la UI**:
    -   Mientras se espera la respuesta, el estado `isLoading` se establece en `true`, mostrando un indicador de carga en `ChatWindow`.
    -   Cuando se recibe la respuesta de Gemini, `processAiResponse` la procesa con la librería `marked` para convertirla de Markdown a HTML.
    -   El HTML resultante se añade al estado `conversation` como un mensaje de la IA.
    -   La UI se re-renderiza automáticamente para mostrar el nuevo mensaje.

6.  **Transición de Fase**:
    -   Después de recibir una respuesta, `processAiResponse` analiza el contenido del texto en busca de palabras clave (ej: `"FASE 1: Identidad y Propósito"`).
    -   Si encuentra una coincidencia, actualiza el estado `currentPhase`.
    -   Este cambio de estado provoca que el componente `PhaseBanner` muestre la información de la nueva fase.

## 5. Mantenimiento y Futuras Mejoras

-   **Añadir una nueva fase de análisis**: Para extender el proceso, se debe:
    1.  Añadir un nuevo miembro al `enum Phase` en `types.ts`.
    2.  Agregar la configuración de texto para el banner en `PHASE_BANNER_CONTENT` en `constants.ts`.
    3.  Actualizar el `SOCRATIC_SYSTEM_PROMPT` en `constants.ts` con las instrucciones para la nueva fase.
    4.  Añadir la lógica de transición de fase en la función `processAiResponse` de `App.tsx`.

-   **Cambiar el modelo de IA**: El modelo (`gemini-3-flash-preview`) está definido en `services/geminiService.ts`. Puede ser fácilmente sustituido por otro modelo de la familia Gemini.

-   **Gestión de estado**: Para aplicaciones más complejas, se podría considerar una librería de gestión de estado como Zustand o Redux en lugar de `useState` para centralizar y simplificar la lógica de estado.
