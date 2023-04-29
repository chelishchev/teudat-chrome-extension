export class PrepareVisit
{
    constructor({backendService})
    {
        /** @type {BackendService} */
        this.backendService = backendService;
        this.tokenConfig = {};
        this.person = {};
    }

    async loadRequestConfig()
    {
        const syncConfig = document.documentElement.dataset.syncConfig;
        this.tokenConfig = syncConfig === undefined ? {} : JSON.parse(syncConfig);
    }

    getRequestHeaders()
    {
        return {
            accept: "application/json, text/plain, */*",
            "accept-language": "en",
            "content-Type": "application/json",
            "application-api-key": this.tokenConfig["application-api-key"],
            "application-name": this.tokenConfig["application-name"],
            "cache-control": "no-cache",
            pragma: "no-cache",
        };
    }

    async getPreparedVisitToken()
    {
        await this.loadRequestConfig();
        await this.loadPerson();

        let question = await this.makeNewVisit();

        let count = 1;
        while (!this.isQuestionDone(question) && !this.hasError(question))
        {
            question = await this.answerQuestion(
                question
            );

            count++;
            if (count > 3)
            {
                console.warn("Can't get preparedVisitToken");
                return undefined;
            }
        }

        if (this.hasError(question))
        {
            console.warn("Can't get preparedVisitToken");
            return undefined;
        }
        const currentTime = new Date();
        const formattedTime = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();

        console.log('got new preparedVisitToken', question.PreparedVisitToken, formattedTime);

        return question.PreparedVisitToken;
    }

    async loadPerson()
    {
        this.person = await this.backendService.getUserData()
    }

    getPersonId()
    {
        return this.person.idNumber;
    }

    getPersonShortPhone()
    {
        return this.person.shortMobilePhone;
    }

    getAnswerTextByQuestionId(questionId)
    {
        const answers = {
            113: this.getPersonId(),
            114: this.getPersonShortPhone(),
        };

        return answers[questionId] || console.warn("Unknown questionId", questionId);
    }

    async answerQuestion(questionData)
    {
        const preparedVisitToken = questionData.PreparedVisitToken;
        const response = await fetch(
            `https://piba-api.myvisit.com/CentralAPI/PreparedVisit/${preparedVisitToken}/Answer`,
            {
                headers: this.getRequestHeaders(),
                referrer: "https://piba.myvisit.com/",
                referrerPolicy: "no-referrer-when-downgrade",
                body: JSON.stringify(this.buildPayloadForAnswer(questionData)),
                method: "POST",
                mode: "cors",
                credentials: "include",
            }
        );

        return response.ok ? response.json().then((res) => res.Data) : undefined;
    }

    buildPayloadForAnswer(questionData)
    {
        return {
            PreparedVisitToken: questionData.PreparedVisitToken,
            QuestionnaireItemId: questionData.QuestionnaireItem.QuestionnaireItemId,
            QuestionId: questionData.QuestionnaireItem.QuestionId,
            AnswerIds: null,
            AnswerText: this.getAnswerTextByQuestionId(questionData.QuestionnaireItem.QuestionId),
        };
    }

    hasError(questionData)
    {
        return Boolean(questionData.Validation?.Messages?.[0]);
    }

    isQuestionDone(questionData)
    {
        return !Boolean(questionData.QuestionnaireItem);
    }

    async makeNewVisit()
    {
        const response = await fetch(
            "https://piba-api.myvisit.com/CentralAPI/Organization/56/PrepareVisit",
            {
                headers: this.getRequestHeaders(),
                referrer: "https://piba.myvisit.com/",
                referrerPolicy: "no-referrer-when-downgrade",
                body: null,
                method: "POST",
                mode: "cors",
                credentials: "include",
            }
        );

        return response.ok ? response.json().then((res) => res.Data) : undefined;
    }
}