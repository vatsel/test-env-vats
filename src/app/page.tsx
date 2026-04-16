import { loadEnvironmentVariables } from "./actions";
import EnvironmentVariableEditor from "./components/EnvironmentVariableEditor";

export default function Page(){
    const envVars = loadEnvironmentVariables('11111'); // 11111 is a dummy id

    return (
        <main>
            <EnvironmentVariableEditor initialVars={envVars} />
        </main>
    );
}