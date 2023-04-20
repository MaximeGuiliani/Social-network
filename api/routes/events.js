import { Router } from "express";
const router = Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /events'
    });
});

router.post('/', (req, res, next) => {
    const event = {
        name: req.body.name,
        description: req.body.description

    };
    res.status(201).json({
        message: 'Handling POST requests to /events',
        createdEvent: event
    });
});

router.get('/:eventId', (req, res, next) => {
    const id = req.params.eventId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }


});



router.patch('/:eventId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated event!'
    });

});

router.delete('/:eventId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted event!'
    });
});

export default router;