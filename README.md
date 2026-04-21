# collegiate
A web-based college ranking app designed to answer the question: what are the right colleges for you?
live at: thecollegiate.vercel.app
## exigence of the project
As long as colleges have been ranked, not only have the rankers been vague in their criteria, but they have also applied a one-size-fits-all methodology that doesn't speak for the majority of applicants. A pre-med student and a finance student have many completely different priorities, why should they use the same national university ranking?
## how it works
Collegiate computes a real-time match score for the user by prompting them to weight 5 dimensions of college priorities:
- **Post-grad earnings**: median salary of graduates
- **Graduation rate**: the percentage of students completing in 4 and 6 years respectively
- **Net price**: what the average student seeking financial aid pays
- **Student life**: campus experience and student happiness
- **Selectivity**:  acceptance rate of the university, taking place as a representative for the academic environment
Every metric is normalized across the program, and then combined when given user input to deliver a match score, which is what schools are ranked on. As soon as sliders are updated, the rankings switch. 
## website tabs
- **Rankings**: the full table of schools with match percent which are custom weighted by the user
- **Explorer**: the tab to explore different pros and cons to different types of schools, salary and educational data of each school.
- **Schools**: gives a full profile into a school which the user selects.
- **Compare**: side-by-side comparison of 2 schools the user is interested in.
- **My List**: the place to save and track your college list
- **Map**: gives the geographic view of schools.
## tech stack
- React 19
- React Router
- Recharts (data visualization)
- Custom CSS design system
- Deployed through Vercel
## Live Demo
thecollegiate.vercel.app
