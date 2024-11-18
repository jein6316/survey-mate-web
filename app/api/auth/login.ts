import { NextApiRequest, NextApiResponse } from 'next';

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    debugger;
   
        const { username, password } = req.body;
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                // JWT 토큰을 클라이언트에서 세션에 저장하거나, 쿠키에 저장하는 방법을 선택합니다.
                res.status(200).json({ token });
            } else {
                const errorData = await response.json();
                res.status(response.status).json({ error: errorData.message });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
   
    
};

export default loginHandler;