-- Insert sample agent configurations
INSERT INTO mastra_agents (
    resource_id,
    identifier,
    name,
    description,
    model,
    temperature,
    max_tokens,
    instructions
) VALUES
    (
        'agent_general_assistant',
        'general_assistant_v1',
        'General Assistant',
        'A versatile AI assistant for general tasks and conversations',
        'gpt-4',
        0.7,
        2000,
        'You are a helpful and friendly AI assistant. Provide clear, concise, and accurate responses.'
    ),
    (
        'agent_code_expert',
        'code_expert_v1',
        'Code Expert',
        'Specialized AI for programming and technical questions',
        'gpt-4',
        0.3,
        4000,
        'You are an expert programmer. Provide detailed technical explanations and code examples.'
    ),
    (
        'agent_creative_writer',
        'creative_writer_v1',
        'Creative Writer',
        'AI specialized in creative writing and storytelling',
        'gpt-4',
        0.9,
        3000,
        'You are a creative writer. Generate engaging stories and imaginative content.'
    ); 