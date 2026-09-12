// Lazy loader and runner for Pyodide (Python WebAssembly runtime in browser)

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched?: (text: string) => void }) => void;
  setStderr: (options: { batched?: (text: string) => void }) => void;
}

let pyodideInstance: PyodideInterface | null = null;
let pyodideLoadPromise: Promise<PyodideInterface> | null = null;

export type PyodideStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Lazily loads the Pyodide WebAssembly runtime from CDN.
 * Does NOT block initial application load.
 */
export async function getOrLoadPyodide(
  onProgress?: (status: string) => void
): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (pyodideLoadPromise) {
    return pyodideLoadPromise;
  }

  pyodideLoadPromise = new Promise(async (resolve, reject) => {
    try {
      onProgress?.('Loading Python runtime script...');

      // Check if pyodide script is already in document
      if (!(window as unknown as { loadPyodide?: unknown }).loadPyodide) {
        await new Promise<void>((res, rej) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
          script.async = true;
          script.onload = () => res();
          script.onerror = () => rej(new Error('Failed to load Pyodide WebAssembly from CDN'));
          document.head.appendChild(script);
        });
      }

      onProgress?.('Initializing Python WebAssembly compiler...');

      const loadPyodideFn = (window as unknown as {
        loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
      }).loadPyodide;

      if (!loadPyodideFn) {
        throw new Error('Pyodide loader function not found on window object.');
      }

      const pyodide = await loadPyodideFn({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });

      pyodideInstance = pyodide;
      onProgress?.('Python 3.12 WebAssembly Ready');
      resolve(pyodide);
    } catch (err) {
      pyodideLoadPromise = null;
      reject(err);
    }
  });

  return pyodideLoadPromise;
}

export interface PythonExecutionResult {
  stdout: string[];
  stderr: string[];
  result?: string;
  executionTimeMs: number;
  error?: string;
}

/**
 * Safely executes Python code inside Pyodide WebAssembly sandbox.
 */
export async function runPythonCode(
  code: string,
  onStatusUpdate?: (status: string) => void
): Promise<PythonExecutionResult> {
  const startTime = performance.now();
  const stdoutList: string[] = [];
  const stderrList: string[] = [];

  try {
    const pyodide = await getOrLoadPyodide(onStatusUpdate);

    // Redirect stdout & stderr
    pyodide.setStdout({
      batched: (text: string) => {
        stdoutList.push(text);
      },
    });

    pyodide.setStderr({
      batched: (text: string) => {
        stderrList.push(text);
      },
    });

    onStatusUpdate?.('Executing Python code...');
    const rawResult = await pyodide.runPythonAsync(code);
    const executionTimeMs = Math.round(performance.now() - startTime);

    let resultString: string | undefined;
    if (rawResult !== undefined && rawResult !== null) {
      resultString = String(rawResult);
    }

    return {
      stdout: stdoutList,
      stderr: stderrList,
      result: resultString,
      executionTimeMs,
    };
  } catch (err: unknown) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      stdout: stdoutList,
      stderr: stderrList,
      executionTimeMs,
      error: errorMsg,
    };
  }
}
